import vm from "node:vm";
import { tool } from "@openrouter/agent";
import { z } from "zod";
import {
  getScenario4ExpectedResult,
  SCENARIO4_DEFAULT_DATE,
  SCENARIO4_DEFAULT_QUERY,
  SCENARIO4_DEFAULT_SPEAKER,
} from "./data.js";
import { scenario4ResultSchema } from "./types.js";

const executeCodeInputSchema = z.object({
  typescript: z.string().min(1).max(20_000),
});

const executeCodeOutputSchema = z.object({
  ok: z.boolean(),
  result: scenario4ResultSchema.optional(),
  stdout: z.array(z.string()),
  error: z.string().optional(),
});

type Scenario4Api = {
  getDefaultQuery: () => Promise<{ query: string; speaker: string; date: string }>;
  retrieveKeyword: (input?: {
    query?: string;
    speaker?: string;
    date?: string;
  }) => Promise<z.infer<typeof scenario4ResultSchema>>;
};

type LastCodeExecution = {
  at: string;
  code: string;
  ok: boolean;
  result?: z.infer<typeof scenario4ResultSchema>;
  error?: string;
  stdout: string[];
};

let lastScenario4Execution: LastCodeExecution | null = null;

export function consumeLastScenario4CodeExecution() {
  const snapshot = lastScenario4Execution;
  lastScenario4Execution = null;
  return snapshot;
}

function createScenario4Api(): Scenario4Api {
  return {
    getDefaultQuery: async () => ({
      query: SCENARIO4_DEFAULT_QUERY,
      speaker: SCENARIO4_DEFAULT_SPEAKER,
      date: SCENARIO4_DEFAULT_DATE,
    }),
    retrieveKeyword: async (input) => {
      const baseline = getScenario4ExpectedResult();
      return {
        ...baseline,
        query: input?.query ?? baseline.query,
        speaker: input?.speaker ?? baseline.speaker,
        date: input?.date ?? baseline.date,
      };
    },
  };
}

function normalizeModelCode(source: string) {
  return source.trim();
}

class Scenario4CodeExecutionError extends Error {
  readonly stdout: string[];

  constructor(message: string, stdout: string[]) {
    super(message);
    this.name = "Scenario4CodeExecutionError";
    this.stdout = stdout;
  }
}

async function runUserCode(typescript: string) {
  const source = normalizeModelCode(typescript);
  const wrappedTypescript = `async function __model_main() {\n${source}\n}\n__model_main();`;
  const transpiler = new Bun.Transpiler({ loader: "ts" });
  const javascript = transpiler.transformSync(wrappedTypescript);
  const stdout: string[] = [];
  const api = createScenario4Api();

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
    filename: "scenario4_code_mode.generated.js",
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

    const parsed = scenario4ResultSchema.parse(result);
    return { parsed, stdout };
  } catch (error) {
    throw new Scenario4CodeExecutionError(
      error instanceof Error ? error.message : String(error),
      stdout
    );
  }
}

export const executeScenario4Code = tool({
  name: "execute_scenario4_code",
  description:
    "Run model-written TypeScript for scenario 4 in a sandbox with restricted API methods getDefaultQuery() and retrieveKeyword({query?,speaker?,date?}). Return {query,speaker,date,matches}.",
  inputSchema: executeCodeInputSchema,
  outputSchema: executeCodeOutputSchema,
  execute: async (input) => {
    const startedAt = Date.now();
    console.log("[Code Executor] Running scenario 4 model-generated TypeScript...");
    console.log(`[Code Executor] Code length: ${input.typescript.length} chars`);

    try {
      const outcome = await runUserCode(input.typescript);
      console.log(`[Code Executor] Success in ${Date.now() - startedAt}ms.`);

      lastScenario4Execution = {
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
        error instanceof Scenario4CodeExecutionError ? error.stdout : [];

      console.error(`[Code Executor] Failed in ${Date.now() - startedAt}ms.`);
      console.error(`[Code Executor] Reason: ${message}`);

      lastScenario4Execution = {
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
