import { tool } from "@openrouter/agent";
import { and, asc, eq, gte, ilike, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";
import { env } from "../../env.js";
import { customers, transactions } from "../../db/schema.js";

const escapeLike = (value: string) =>
  value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");

const benchmarkObs = (event: string, data: Record<string, unknown>) => {
  console.log(
    JSON.stringify({
      channel: "benchmark-observability",
      benchmark: "1_customer_db_average_spend",
      event,
      ts: new Date().toISOString(),
      ...data,
    })
  );
};

const withDb = async <T>(
  toolName: string,
  operation: () => Promise<T>,
  input: Record<string, unknown>
) => {
  const startMs = Date.now();
  benchmarkObs("tool_start", { toolName, input });

  try {
    const result = await operation();
    benchmarkObs("tool_success", {
      toolName,
      durationMs: Date.now() - startMs,
      resultSummary:
        typeof result === "object" && result !== null
          ? { keys: Object.keys(result as Record<string, unknown>) }
          : { primitive: typeof result },
    });
    return result;
  } catch (error) {
    benchmarkObs("tool_error", {
      toolName,
      durationMs: Date.now() - startMs,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

const customerSummarySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  createdAt: z.iso.datetime(),
});

const transactionRowSchema = z.object({
  id: z.uuid(),
  customerId: z.uuid(),
  amount: z.number(),
  createdAt: z.iso.datetime(),
});

export const getCurrentDatetime = tool({
  name: "get_current_datetime",
  description: "Get the current ISO datetime to anchor time-window analysis.",
  inputSchema: z.object({}),
  outputSchema: z.object({ now: z.iso.datetime() }),
  execute: async () =>
    withDb(
      "get_current_datetime",
      async () => ({ now: new Date().toISOString() }),
      {}
    ),
});

export const getAllCustomers = tool({
  name: "get_all_customers",
  description: "Fetch all customer rows with optional pagination.",
  inputSchema: z.object({
    limit: z.number().int().positive().max(200).default(100),
    offset: z.number().int().min(0).default(0),
  }),
  outputSchema: z.object({
    customers: z.array(customerSummarySchema),
    count: z.number().int().nonnegative(),
    returnedCount: z.number().int().nonnegative(),
  }),
  execute: async (input) =>
    withDb(
      "get_all_customers",
      async () => {
        const client = postgres(env.DATABASE_URL);
        const db = drizzle(client, { schema: { customers } });

        try {
          const totalResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(customers);

          const rows = await db
            .select({
              id: customers.id,
              name: customers.name,
              email: customers.email,
              createdAt: customers.createdAt,
            })
            .from(customers)
            .orderBy(asc(customers.createdAt))
            .limit(input.limit)
            .offset(input.offset);

          return {
            customers: rows.map((row) => ({
              id: row.id,
              name: row.name,
              email: row.email,
              createdAt: row.createdAt.toISOString(),
            })),
            count: totalResult[0]?.count ?? 0,
            returnedCount: rows.length,
          };
        } finally {
          await client.end();
        }
      },
      input
    ),
});

export const searchCustomersByName = tool({
  name: "search_customers_by_name",
  description: "Search customer rows by (partial) name, case-insensitive.",
  inputSchema: z.object({
    query: z.string().min(1),
    limit: z.number().int().positive().max(100).default(20),
  }),
  outputSchema: z.object({
    customers: z.array(customerSummarySchema),
    count: z.number().int().nonnegative(),
    returnedCount: z.number().int().nonnegative(),
  }),
  execute: async (input) =>
    withDb(
      "search_customers_by_name",
      async () => {
        const client = postgres(env.DATABASE_URL);
        const db = drizzle(client, { schema: { customers } });
        const escapedQuery = escapeLike(input.query);

        try {
          const totalResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(customers)
            .where(ilike(customers.name, `%${escapedQuery}%`));

          const rows = await db
            .select({
              id: customers.id,
              name: customers.name,
              email: customers.email,
              createdAt: customers.createdAt,
            })
            .from(customers)
            .where(ilike(customers.name, `%${escapedQuery}%`))
            .orderBy(asc(customers.name))
            .limit(input.limit);

          return {
            customers: rows.map((row) => ({
              id: row.id,
              name: row.name,
              email: row.email,
              createdAt: row.createdAt.toISOString(),
            })),
            count: totalResult[0]?.count ?? 0,
            returnedCount: rows.length,
          };
        } finally {
          await client.end();
        }
      },
      input
    ),
});

export const listTransactionsInWindow = tool({
  name: "list_transactions_in_window",
  description:
    "List transaction rows in a date window. Optional customerId filter.",
  inputSchema: z.object({
    fromIso: z.iso.datetime(),
    toIso: z.iso.datetime(),
    customerId: z.uuid().optional(),
    limit: z.number().int().positive().max(1000).default(500),
  }),
  outputSchema: z.object({
    transactions: z.array(transactionRowSchema),
    count: z.number().int().nonnegative(),
  }),
  execute: async (input) =>
    withDb(
      "list_transactions_in_window",
      async () => {
        const from = new Date(input.fromIso);
        const to = new Date(input.toIso);

        const client = postgres(env.DATABASE_URL);
        const db = drizzle(client, { schema: { transactions } });

        try {
          const rows = await db
            .select({
              id: transactions.id,
              customerId: transactions.customerId,
              amount: transactions.amount,
              createdAt: transactions.createdAt,
            })
            .from(transactions)
            .where(
              input.customerId
                ? and(
                    eq(transactions.customerId, input.customerId),
                    gte(transactions.createdAt, from),
                    lte(transactions.createdAt, to)
                  )
                : and(
                    gte(transactions.createdAt, from),
                    lte(transactions.createdAt, to)
                  )
            )
            .orderBy(asc(transactions.createdAt))
            .limit(input.limit);

          return {
            transactions: rows.map((row) => ({
              id: row.id,
              customerId: row.customerId,
              amount: Number(row.amount),
              createdAt: row.createdAt.toISOString(),
            })),
            count: rows.length,
          };
        } finally {
          await client.end();
        }
      },
      input
    ),
});

export const computeCustomerSpendStats = tool({
  name: "compute_customer_spend_stats",
  description:
    "Compute transaction count, total spend, and average spend for a customer within a date window.",
  inputSchema: z.object({
    customerId: z.uuid(),
    fromIso: z.iso.datetime(),
    toIso: z.iso.datetime(),
  }),
  outputSchema: z.object({
    customerId: z.uuid(),
    fromIso: z.iso.datetime(),
    toIso: z.iso.datetime(),
    transactionCount: z.number().int().nonnegative(),
    totalSpend: z.number(),
    averageSpend: z.number(),
  }),
  execute: async (input) =>
    withDb(
      "compute_customer_spend_stats",
      async () => {
        const from = new Date(input.fromIso);
        const to = new Date(input.toIso);

        const client = postgres(env.DATABASE_URL);
        const db = drizzle(client, { schema: { transactions } });

        try {
          const rows = await db
            .select({
              transactionCount: sql<number>`count(*)::int`,
              totalSpend: sql<number>`coalesce(sum(${transactions.amount}), 0)::float8`,
              averageSpend: sql<number>`coalesce(avg(${transactions.amount}), 0)::float8`,
            })
            .from(transactions)
            .where(
              and(
                eq(transactions.customerId, input.customerId),
                gte(transactions.createdAt, from),
                lte(transactions.createdAt, to)
              )
            );

          const stats = rows[0] ?? {
            transactionCount: 0,
            totalSpend: 0,
            averageSpend: 0,
          };

          return {
            customerId: input.customerId,
            fromIso: input.fromIso,
            toIso: input.toIso,
            transactionCount: stats.transactionCount,
            totalSpend: Number(Number(stats.totalSpend ?? 0).toFixed(2)),
            averageSpend: Number(Number(stats.averageSpend ?? 0).toFixed(2)),
          };
        } finally {
          await client.end();
        }
      },
      input
    ),
});

export const benchmark1Tools = [
  getCurrentDatetime,
  getAllCustomers,
  searchCustomersByName,
  listTransactionsInWindow,
  computeCustomerSpendStats,
] as const;
