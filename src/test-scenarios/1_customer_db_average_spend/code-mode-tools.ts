import vm from "node:vm";
import { tool } from "@openrouter/agent";
import { z } from "zod";
import {
  countCustomersByNameData,
  countTransactionsInWindowData,
  computeCustomerSpendStatsData,
  getAllCustomersData,
  getTotalCustomersCountData,
  listTransactionsInWindowData,
  searchCustomersByNameData,
} from "./data.js";

const codeModeAnswerSchema = z.object({
  topCustomerId: z.uuid(),
  topCustomerName: z.string().min(1),
  transactionCount: z.number().int().nonnegative(),
  totalSpend: z.number(),
  averageSpend: z.number(),
  fromIso: z.iso.datetime(),
  toIso: z.iso.datetime(),
});

const codeModeApiCustomerSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  createdAt: z.iso.datetime(),
});

const codeModeApiTransactionSchema = z.object({
  id: z.uuid(),
  customerId: z.uuid(),
  amount: z.number(),
  createdAt: z.iso.datetime(),
});

const executeCodeInputSchema = z.object({
  typescript: z.string().min(1).max(20_000),
});

const executeCodeOutputSchema = z.object({
  ok: z.boolean(),
  result: codeModeAnswerSchema.optional(),
  stdout: z.array(z.string()),
  error: z.string().optional(),
});

type CodeModeApi = {
  getCurrentDatetime: () => Promise<{ now: string }>;
  getAllCustomers: (input?: { limit?: number; offset?: number }) => Promise<{
    customers: z.infer<typeof codeModeApiCustomerSchema>[];
    count: number;
    returnedCount: number;
  }>;
  searchCustomersByName: (input: {
    query: string;
    limit?: number;
  }) => Promise<{
    customers: z.infer<typeof codeModeApiCustomerSchema>[];
    count: number;
    returnedCount: number;
  }>;
  listTransactionsInWindow: (input: {
    fromIso: string;
    toIso: string;
    customerId?: string;
    limit?: number;
  }) => Promise<{
    transactions: z.infer<typeof codeModeApiTransactionSchema>[];
    count: number;
    returnedCount: number;
  }>;
  computeCustomerSpendStats: (input: {
    customerId: string;
    fromIso: string;
    toIso: string;
  }) => Promise<Awaited<ReturnType<typeof computeCustomerSpendStatsData>>>;
  solveScenario1: () => Promise<z.infer<typeof codeModeAnswerSchema>>;
};

type LastCodeExecution = {
  at: string;
  code: string;
  ok: boolean;
  result?: z.infer<typeof codeModeAnswerSchema>;
  error?: string;
  stdout: string[];
};

let lastScenario1CodeExecution: LastCodeExecution | null = null;

export function consumeLastScenario1CodeExecution() {
  const snapshot = lastScenario1CodeExecution;
  lastScenario1CodeExecution = null;
  return snapshot;
}

class ScenarioCodeExecutionError extends Error {
  readonly stdout: string[];

  constructor(message: string, stdout: string[]) {
    super(message);
    this.name = "ScenarioCodeExecutionError";
    this.stdout = stdout;
  }
}

function stripCodeFences(source: string) {
  const trimmed = source.trim();
  const fullBlockMatch = trimmed.match(
    /^```(?:ts|typescript|js|javascript)?\s*([\s\S]*?)\s*```$/i
  );
  return fullBlockMatch?.[1]?.trim() ?? trimmed;
}

function normalizeModelCode(source: string) {
  let result = stripCodeFences(source).trim();

  if (/^\(async\s*\(\)\s*=>\s*\{[\s\S]*\}\s*\)\s*\(\s*\)\s*;?$/m.test(result)) {
    result = result.replace(/^\(async\s*\(\)\s*=>\s*\{/, "");
    result = result.replace(/\}\s*\)\s*\(\s*\)\s*;?$/m, "");
  }

  if (/^async\s+function\s+main\s*\(\)\s*\{[\s\S]*\}\s*main\s*\(\s*\)\s*;?$/m.test(result)) {
    result = result.replace(/\n?main\s*\(\s*\)\s*;?\s*$/m, "\nreturn await main();");
  }

  return result;
}

function createCodeModeApi(): CodeModeApi {
  return {
    getCurrentDatetime: async () => ({ now: new Date().toISOString() }),
    getAllCustomers: async (input) => {
      const limit = input?.limit ?? 200;
      const offset = input?.offset ?? 0;
      const customers = await getAllCustomersData({ limit, offset });
      const count = await getTotalCustomersCountData();
      return {
        customers: customers.map((customer) => codeModeApiCustomerSchema.parse(customer)),
        count,
        returnedCount: customers.length,
      };
    },
    searchCustomersByName: async (input) => {
      const limit = input.limit ?? 100;
      const count = await countCustomersByNameData({ query: input.query });
      const customers = await searchCustomersByNameData({
        query: input.query,
        limit,
      });
      return {
        customers: customers.map((customer) => codeModeApiCustomerSchema.parse(customer)),
        count,
        returnedCount: customers.length,
      };
    },
    listTransactionsInWindow: async (input) => {
      const limit = input.limit ?? 2_000;
      const count = await countTransactionsInWindowData({
        fromIso: input.fromIso,
        toIso: input.toIso,
        ...(input.customerId ? { customerId: input.customerId } : {}),
      });
      const transactions = await listTransactionsInWindowData({
        fromIso: input.fromIso,
        toIso: input.toIso,
        limit,
        ...(input.customerId ? { customerId: input.customerId } : {}),
      });

      return {
        transactions: transactions.map((tx) => codeModeApiTransactionSchema.parse(tx)),
        count,
        returnedCount: transactions.length,
      };
    },
    computeCustomerSpendStats: async (input) => computeCustomerSpendStatsData(input),
    solveScenario1: async () => {
      const toIso = new Date().toISOString();
      const fromIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const { transactions } = await createCodeModeApi().listTransactionsInWindow({
        fromIso,
        toIso,
        limit: 50_000,
      });

      const perCustomer = new Map<string, { transactionCount: number; totalSpend: number }>();

      for (const tx of transactions) {
        const current = perCustomer.get(tx.customerId) ?? {
          transactionCount: 0,
          totalSpend: 0,
        };
        current.transactionCount += 1;
        current.totalSpend += tx.amount;
        perCustomer.set(tx.customerId, current);
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
        throw new Error("No transactions found in the past week for solveScenario1");
      }

      const { customers } = await createCodeModeApi().getAllCustomers({ limit: 10_000, offset: 0 });
      const customer = customers.find((entry) => entry.id === winner[0]);
      if (!customer) {
        throw new Error("Top customer id not found in customer list");
      }

      const transactionCount = winner[1].transactionCount;
      const totalSpend = Number(winner[1].totalSpend.toFixed(2));
      const averageSpend = Number((totalSpend / transactionCount).toFixed(2));

      return {
        topCustomerId: customer.id,
        topCustomerName: customer.name,
        transactionCount,
        totalSpend,
        averageSpend,
        fromIso,
        toIso,
      };
    },
  };
}

async function runUserCode(typescript: string) {
  const source = normalizeModelCode(typescript);
  const wrappedTypescript = `async function __model_main() {\n${source}\n}\n__model_main();`;
  const transpiler = new Bun.Transpiler({ loader: "ts" });
  const javascript = transpiler.transformSync(wrappedTypescript);
  const stdout: string[] = [];
  const api = createCodeModeApi();

  const context = vm.createContext({
    api,
    Date,
    Math,
    JSON,
    Number,
    String,
    Boolean,
    RegExp,
    Array,
    Object,
    Promise,
    setTimeout,
    clearTimeout,
    console: {
      log: (...values: unknown[]) => {
        stdout.push(
          values
            .map((value) =>
              typeof value === "string" ? value : JSON.stringify(value)
            )
            .join(" ")
        );
      },
    },
  });

  const script = new vm.Script(`"use strict";\n${javascript}`, {
    filename: "scenario1_code_mode.generated.js",
  });

  try {
    const executionResult = script.runInContext(context, { timeout: 10_000 });

    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    const result = await Promise.race([
      Promise.resolve(executionResult).then((value) => {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        return value;
      }),
      new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(
          () => reject(new Error("Code execution timed out after 10s")),
          10_000
        );
      }),
    ]);

    const parsed = codeModeAnswerSchema.parse(result);
    return { parsed, stdout };
  } catch (error) {
    throw new ScenarioCodeExecutionError(
      error instanceof Error ? error.message : String(error),
      stdout
    );
  }
}

export const executeScenario1Code = tool({
  name: "execute_scenario1_code",
  description:
    "Run model-written TypeScript in a sandbox with only a restricted `api` object (no raw DB access). API contracts: getCurrentDatetime() -> { now }; getAllCustomers({limit,offset}) -> { customers:[{ id,name,email,createdAt }], count, returnedCount }; searchCustomersByName({query,limit}) -> same customer shape; listTransactionsInWindow({fromIso,toIso,customerId?,limit}) -> { transactions:[{ id,customerId,amount,createdAt }], count, returnedCount }; computeCustomerSpendStats({customerId,fromIso,toIso}) -> { customerId, fromIso, toIso, transactionCount, totalSpend, averageSpend }. The code must RETURN exactly {topCustomerId,topCustomerName,transactionCount,totalSpend,averageSpend,fromIso,toIso}.",
  inputSchema: executeCodeInputSchema,
  outputSchema: executeCodeOutputSchema,
  execute: async (input) => {
    const startedAt = Date.now();
    console.log("[Code Executor] Running model-generated TypeScript...");
    console.log(`[Code Executor] Code length: ${input.typescript.length} chars`);

    try {
      const outcome = await runUserCode(input.typescript);

      console.log(
        `[Code Executor] Success in ${Date.now() - startedAt}ms. Result object validated.`
      );
      console.log(
        `[Code Executor] Final result: topCustomerId=${outcome.parsed.topCustomerId}, topCustomerName=${outcome.parsed.topCustomerName}, transactionCount=${outcome.parsed.transactionCount}, averageSpend=${outcome.parsed.averageSpend}`
      );

      lastScenario1CodeExecution = {
        at: new Date().toISOString(),
        code: input.typescript,
        ok: true,
        result: outcome.parsed,
        stdout: outcome.stdout,
      };

      return {
        ok: true,
        result: outcome.parsed,
        stdout: outcome.stdout,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const stdout =
        error instanceof ScenarioCodeExecutionError ? error.stdout : [];
      console.error(`[Code Executor] Failed in ${Date.now() - startedAt}ms.`);
      console.error(`[Code Executor] Reason: ${message}`);
      if (stdout.length > 0) {
        console.error(`[Code Executor] Captured stdout: ${stdout.join(" | ")}`);
      }

      lastScenario1CodeExecution = {
        at: new Date().toISOString(),
        code: input.typescript,
        ok: false,
        error: message,
        stdout,
      };

      return {
        ok: false,
        stdout,
        error: message,
      };
    }
  },
});
