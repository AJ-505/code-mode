import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../src/env.js";
import { customers, transactions } from "../src/db/schema.js";

const sql = postgres(env.DATABASE_URL, { max: 1 });
const db = drizzle(sql, { schema: { customers, transactions } });

const FIRST_NAMES = [
  "Avery",
  "Jordan",
  "Morgan",
  "Parker",
  "Quinn",
  "Riley",
  "Taylor",
  "Casey",
  "Dakota",
  "Emerson",
  "Finley",
  "Harper",
  "Jamie",
  "Kendall",
  "Logan",
  "Marley",
  "Noel",
  "Payton",
  "Reese",
  "Sawyer",
];

const LAST_NAMES = [
  "Anderson",
  "Bennett",
  "Carter",
  "Diaz",
  "Edwards",
  "Foster",
  "Garcia",
  "Hayes",
  "Iverson",
  "Jenkins",
  "Kim",
  "Lewis",
  "Mitchell",
  "Nguyen",
  "Owens",
  "Patel",
  "Reed",
  "Sanders",
  "Turner",
  "Walker",
];

function mulberry32(seed: number) {
  let t = seed;
  return function next() {
    t += 0x6d2b79f5;
    let n = Math.imul(t ^ (t >>> 15), t | 1);
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(1_337_001);

function randomInRange(min: number, max: number) {
  return min + (max - min) * rng();
}

function randomInt(min: number, max: number) {
  return Math.floor(randomInRange(min, max + 1));
}

function randomDateBetween(start: Date, end: Date) {
  const startMs = start.getTime();
  const endMs = end.getTime();
  return new Date(startMs + rng() * (endMs - startMs));
}

async function seedScenario1() {
  const shouldReset = !Bun.argv.includes("--append");
  const now = new Date();
  const thirtyFiveDaysAgo = new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000);
  const eightDaysAgo = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  if (shouldReset) {
    await db.delete(transactions);
    await db.delete(customers);
  }

  const customerRows = Array.from({ length: 80 }, (_, index) => {
    if (index === 0) {
      return {
        name: "Avery Benchmark",
        email: "avery.benchmark+scenario1@example.com",
        createdAt: randomDateBetween(thirtyFiveDaysAgo, eightDaysAgo),
      };
    }

    const first = FIRST_NAMES[index % FIRST_NAMES.length];
    const last = LAST_NAMES[(index * 3) % LAST_NAMES.length];
    const slug = `${first}.${last}.${index + 1}`.toLowerCase();

    return {
      name: `${first} ${last}`,
      email: `${slug}@example.com`,
      createdAt: randomDateBetween(thirtyFiveDaysAgo, eightDaysAgo),
    };
  });

  const insertedCustomers = await db
    .insert(customers)
    .values(customerRows)
    .returning({ id: customers.id, name: customers.name });

  const topCustomer = insertedCustomers[0];
  if (!topCustomer) throw new Error("Failed to create top customer row");

  const txRows: Array<{
    customerId: string;
    amount: string;
    createdAt: Date;
  }> = [];

  for (let i = 0; i < 42; i += 1) {
    txRows.push({
      customerId: topCustomer.id,
      amount: randomInRange(90, 390).toFixed(2),
      createdAt: randomDateBetween(sevenDaysAgo, now),
    });
  }

  for (const [index, customer] of insertedCustomers.entries()) {
    if (index === 0) continue;

    const totalTx = randomInt(4, 16);
    const weeklyTx = Math.min(randomInt(0, 9), totalTx);
    const olderTx = totalTx - weeklyTx;

    for (let i = 0; i < weeklyTx; i += 1) {
      txRows.push({
        customerId: customer.id,
        amount: randomInRange(8, 180).toFixed(2),
        createdAt: randomDateBetween(sevenDaysAgo, now),
      });
    }

    for (let i = 0; i < olderTx; i += 1) {
      txRows.push({
        customerId: customer.id,
        amount: randomInRange(5, 220).toFixed(2),
        createdAt: randomDateBetween(thirtyFiveDaysAgo, eightDaysAgo),
      });
    }
  }

  for (let start = 0; start < txRows.length; start += 500) {
    const slice = txRows.slice(start, start + 500);
    await db.insert(transactions).values(slice);
  }

  console.log(
    `[seed] scenario1 complete reset=${shouldReset} customers=${insertedCustomers.length} transactions=${txRows.length}`
  );
  console.log(
    `[seed] expected top customer likely=${topCustomer.name} weeklyTransactions=42 (deterministic seed)`
  );
}

try {
  await seedScenario1();
} finally {
  await sql.end();
}
