import vm from "node:vm";
import { tool } from "@openrouter/agent";
import { z } from "zod";
import {
  computeCustomerSpendStatsData,
  getAllCustomersData,
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
    customers: Awaited<ReturnType<typeof getAllCustomersData>>;
    count: number;
    returnedCount: number;
  }>;
  searchCustomersByName: (input: {
    query: string;
    limit?: number;
  }) => Promise<{
    customers: Awaited<ReturnType<typeof searchCustomersByNameData>>;
    count: number;
    returnedCount: number;
  }>;
  listTransactionsInWindow: (input: {
    fromIso: string;
    toIso: string;
    customerId?: string;
    limit?: number;
  }) => Promise<{
    transactions: Awaited<ReturnType<typeof listTransactionsInWindowData>>;
    count: number;
    returnedCount: number;
  }>;
  computeCustomerSpendStats: (input: {
    customerId: string;
    fromIso: string;
    toIso: string;
  }) => Promise<Awaited<ReturnType<typeof computeCustomerSpendStatsData>>>;
};

function stripCodeFences(source: string) {
  const trimmed = source.trim();
  const fullBlockMatch = trimmed.match(
    /^```(?:ts|typescript|js|javascript)?\s*([\s\S]*?)\s*```$/i
  );
  return fullBlockMatch?.[1]?.trim() ?? trimmed;
}

function createCodeModeApi(): CodeModeApi {
  return {
    getCurrentDatetime: async () => ({ now: new Date().toISOString() }),
    getAllCustomers: async (input) => {
      const limit = input?.limit ?? 200;
      const offset = input?.offset ?? 0;
      const customers = await getAllCustomersData({ limit, offset });
      return {
        customers,
        count: customers.length,
        returnedCount: customers.length,
      };
    },
    searchCustomersByName: async (input) => {
      const limit = input.limit ?? 100;
      const customers = await searchCustomersByNameData({
        query: input.query,
        limit,
      });
      return {
        customers,
        count: customers.length,
        returnedCount: customers.length,
      };
    },
    listTransactionsInWindow: async (input) => {
      const limit = input.limit ?? 2_000;
      const transactions = await listTransactionsInWindowData({
        fromIso: input.fromIso,
        toIso: input.toIso,
        limit,
        ...(input.customerId ? { customerId: input.customerId } : {}),
      });

      return {
        transactions,
        count: transactions.length,
        returnedCount: transactions.length,
      };
    },
    computeCustomerSpendStats: async (input) => computeCustomerSpendStatsData(input),
  };
}

async function runUserCode(typescript: string) {
  const source = stripCodeFences(typescript);
  const transpiler = new Bun.Transpiler({ loader: "ts" });
  const javascript = transpiler.transformSync(source);
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

  const wrapped = `"use strict";\n(async () => {\n${javascript}\n})()`;
  const script = new vm.Script(wrapped, {
    filename: "scenario1_code_mode.generated.js",
  });

  const executionResult = script.runInContext(context, { timeout: 10_000 });

  const result = await Promise.race([
    Promise.resolve(executionResult),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Code execution timed out after 10s")), 10_000);
    }),
  ]);

  const parsed = codeModeAnswerSchema.parse(result);
  return { parsed, stdout };
}

export const executeScenario1Code = tool({
  name: "execute_scenario1_code",
  description:
    "Run model-written TypeScript in a sandbox with only a restricted `api` object (no raw DB access). `api` methods: getCurrentDatetime(), getAllCustomers({limit,offset}), searchCustomersByName({query,limit}), listTransactionsInWindow({fromIso,toIso,customerId?,limit}), computeCustomerSpendStats({customerId,fromIso,toIso}). The code must return {topCustomerId,topCustomerName,transactionCount,totalSpend,averageSpend,fromIso,toIso}.",
  inputSchema: executeCodeInputSchema,
  outputSchema: executeCodeOutputSchema,
  execute: async (input) => {
    const startedAt = Date.now();
    console.log(
      `[tool:execute_scenario1_code] start codeLength=${input.typescript.length} at=${new Date().toISOString()}`
    );

    try {
      const outcome = await runUserCode(input.typescript);

      console.log(
        `[tool:execute_scenario1_code] success durationMs=${Date.now() - startedAt}`
      );
      return {
        ok: true,
        result: outcome.parsed,
        stdout: outcome.stdout,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(
        `[tool:execute_scenario1_code] error durationMs=${Date.now() - startedAt} message=${message}`
      );
      return {
        ok: false,
        stdout: [],
        error: message,
      };
    }
  },
});
