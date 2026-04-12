import { tool } from "@openrouter/agent";
import { z } from "zod";
import {
  countCustomersByNameData,
  countTransactionsInWindowData,
  closeScenario1DbPool,
  computeCustomerSpendStatsData,
  getAllCustomersData,
  getTotalCustomersCountData,
  listTransactionsInWindowData,
  searchCustomersByNameData,
} from "./data.js";

export async function closeBenchmark1DbPool() {
  await closeScenario1DbPool();
}

const withObservability = async <T>(
  toolName: string,
  operation: () => Promise<T>,
  input: Record<string, unknown>
) => {
  const startMs = Date.now();
  console.log(
    `[tool:${toolName}] start input=${JSON.stringify(input)} at=${new Date().toISOString()}`
  );

  try {
    const result = await operation();
    const resultSummary =
      typeof result === "object" && result !== null
        ? `keys=${Object.keys(result as Record<string, unknown>).join(",")}`
        : `type=${typeof result}`;

    console.log(
      `[tool:${toolName}] success durationMs=${Date.now() - startMs} ${resultSummary}`
    );
    return result;
  } catch (error) {
    console.error(
      `[tool:${toolName}] error durationMs=${Date.now() - startMs} message=${error instanceof Error ? error.message : String(error)}`
    );
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
  execute: async () => ({ now: new Date().toISOString() }),
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
    withObservability(
      "get_all_customers",
      async () => {
        const totalCount = await getTotalCustomersCountData();
        const rows = await getAllCustomersData({
          limit: input.limit,
          offset: input.offset,
        });

        return {
          customers: rows,
          count: totalCount,
          returnedCount: rows.length,
        };
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
    withObservability(
      "search_customers_by_name",
      async () => {
        const totalCount = await countCustomersByNameData({ query: input.query });
        const rows = await searchCustomersByNameData({
          query: input.query,
          limit: input.limit,
        });

        return {
          customers: rows,
          count: totalCount,
          returnedCount: rows.length,
        };
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
    returnedCount: z.number().int().nonnegative(),
  }),
  execute: async (input) =>
    withObservability(
      "list_transactions_in_window",
      async () => {
        const totalCount = await countTransactionsInWindowData({
          fromIso: input.fromIso,
          toIso: input.toIso,
          ...(input.customerId ? { customerId: input.customerId } : {}),
        });
        const rows = await listTransactionsInWindowData({
          fromIso: input.fromIso,
          toIso: input.toIso,
          limit: input.limit,
          ...(input.customerId ? { customerId: input.customerId } : {}),
        });

        return {
          transactions: rows,
          count: totalCount,
          returnedCount: rows.length,
        };
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
    withObservability(
      "compute_customer_spend_stats",
      async () => computeCustomerSpendStatsData(input),
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
