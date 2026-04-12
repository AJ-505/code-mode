import { and, asc, eq, gte, ilike, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../../env.js";
import { customers, transactions } from "../../db/schema.js";

const pool = postgres(env.DATABASE_URL, { max: 10 });

export const scenario1Db = drizzle(pool, { schema: { customers, transactions } });

export type CustomerSummary = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type TransactionSummary = {
  id: string;
  customerId: string;
  amount: number;
  createdAt: string;
};

export type CustomerSpendStats = {
  customerId: string;
  fromIso: string;
  toIso: string;
  transactionCount: number;
  totalSpend: number;
  averageSpend: number;
};

export type Scenario1ExpectedResult = {
  fromIso: string;
  toIso: string;
  topCustomerId: string;
  topCustomerName: string;
  transactionCount: number;
  averageSpend: number;
  totalSpend: number;
};

export async function closeScenario1DbPool() {
  await pool.end();
}

const escapeLike = (value: string) =>
  value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");

export async function getAllCustomersData(input: { limit: number; offset: number }) {
  const rows = await scenario1Db
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

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function searchCustomersByNameData(input: {
  query: string;
  limit: number;
}) {
  const escapedQuery = escapeLike(input.query);
  const rows = await scenario1Db
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

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function listTransactionsInWindowData(input: {
  fromIso: string;
  toIso: string;
  customerId?: string;
  limit: number;
}) {
  const from = new Date(input.fromIso);
  const to = new Date(input.toIso);

  const whereClause = input.customerId
    ? and(
        eq(transactions.customerId, input.customerId),
        gte(transactions.createdAt, from),
        lte(transactions.createdAt, to)
      )
    : and(gte(transactions.createdAt, from), lte(transactions.createdAt, to));

  const rows = await scenario1Db
    .select({
      id: transactions.id,
      customerId: transactions.customerId,
      amount: transactions.amount,
      createdAt: transactions.createdAt,
    })
    .from(transactions)
    .where(whereClause)
    .orderBy(asc(transactions.createdAt))
    .limit(input.limit);

  return rows.map((row) => ({
    id: row.id,
    customerId: row.customerId,
    amount: Number(row.amount),
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function computeCustomerSpendStatsData(input: {
  customerId: string;
  fromIso: string;
  toIso: string;
}): Promise<CustomerSpendStats> {
  const rows = await listTransactionsInWindowData({
    customerId: input.customerId,
    fromIso: input.fromIso,
    toIso: input.toIso,
    limit: 10_000,
  });

  const transactionCount = rows.length;
  const totalSpend = Number(
    rows.reduce((sum, row) => sum + row.amount, 0).toFixed(2)
  );
  const averageSpend =
    transactionCount > 0
      ? Number((totalSpend / transactionCount).toFixed(2))
      : 0;

  return {
    customerId: input.customerId,
    fromIso: input.fromIso,
    toIso: input.toIso,
    transactionCount,
    totalSpend,
    averageSpend,
  };
}

export async function computeScenario1ExpectedResult(
  referenceNow = new Date()
): Promise<Scenario1ExpectedResult> {
  const toIso = referenceNow.toISOString();
  const fromIso = new Date(
    referenceNow.getTime() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const rows = await listTransactionsInWindowData({
    fromIso,
    toIso,
    limit: 50_000,
  });

  if (rows.length === 0) {
    throw new Error(
      "No transactions found in the last 7 days. Run the seed script first."
    );
  }

  const perCustomer = new Map<
    string,
    { transactionCount: number; totalSpend: number }
  >();

  for (const row of rows) {
    const current = perCustomer.get(row.customerId) ?? {
      transactionCount: 0,
      totalSpend: 0,
    };
    current.transactionCount += 1;
    current.totalSpend += row.amount;
    perCustomer.set(row.customerId, current);
  }

  const ranked = [...perCustomer.entries()].sort((a, b) => {
    if (b[1].transactionCount !== a[1].transactionCount) {
      return b[1].transactionCount - a[1].transactionCount;
    }

    if (b[1].totalSpend !== a[1].totalSpend) {
      return b[1].totalSpend - a[1].totalSpend;
    }

    return a[0].localeCompare(b[0]);
  });

  const winner = ranked[0];

  if (!winner) {
    throw new Error("Unable to derive top customer from transaction data.");
  }

  const customerRows = await scenario1Db
    .select({ id: customers.id, name: customers.name })
    .from(customers)
    .where(eq(customers.id, winner[0]))
    .limit(1);

  const topCustomer = customerRows[0];

  if (!topCustomer) {
    throw new Error("Top customer not found in customers table.");
  }

  const transactionCount = winner[1].transactionCount;
  const totalSpend = Number(winner[1].totalSpend.toFixed(2));
  const averageSpend = Number((totalSpend / transactionCount).toFixed(2));

  return {
    fromIso,
    toIso,
    topCustomerId: topCustomer.id,
    topCustomerName: topCustomer.name,
    transactionCount,
    averageSpend,
    totalSpend,
  };
}
