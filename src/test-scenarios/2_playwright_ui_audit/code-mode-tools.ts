import vm from "node:vm";
import { tool } from "@openrouter/agent";
import { z } from "zod";
import { getScenario2ExpectedResult, SCENARIO2_SITE_URL } from "./data.js";
import { scenario2ResultSchema } from "./types.js";

const executeCodeInputSchema = z.object({
  typescript: z.string().min(1).max(20_000),
});

const executeCodeOutputSchema = z.object({
  ok: z.boolean(),
  result: scenario2ResultSchema.optional(),
  stdout: z.array(z.string()),
  error: z.string().optional(),
});

type Scenario2Api = {
  getTargetSite: () => Promise<{ siteUrl: string }>;
  auditSite: (input?: { siteUrl?: string }) => Promise<z.infer<typeof scenario2ResultSchema>>;
};

type LastCodeExecution = {
  at: string;
  code: string;
  ok: boolean;
  result?: z.infer<typeof scenario2ResultSchema>;
  error?: string;
  stdout: string[];
};

let lastScenario2Execution: LastCodeExecution | null = null;

export function consumeLastScenario2CodeExecution() {
  const snapshot = lastScenario2Execution;
  lastScenario2Execution = null;
  return snapshot;
}

function createScenario2Api(): Scenario2Api {
  return {
    getTargetSite: async () => ({ siteUrl: SCENARIO2_SITE_URL }),
    auditSite: async (input) => {
      const baseline = getScenario2ExpectedResult();
      return {
        ...baseline,
        siteUrl: input?.siteUrl ?? SCENARIO2_SITE_URL,
      };
    },
  };
}

function normalizeModelCode(source: string) {
  return source.trim();
}

class Scenario2CodeExecutionError extends Error {
  readonly stdout: string[];

  constructor(message: string, stdout: string[]) {
    super(message);
    this.name = "Scenario2CodeExecutionError";
    this.stdout = stdout;
  }
}

async function runUserCode(typescript: string) {
  const source = normalizeModelCode(typescript);
  const wrappedTypescript = `async function __model_main() {\n${source}\n}\n__model_main();`;
  const transpiler = new Bun.Transpiler({ loader: "ts" });
  const javascript = transpiler.transformSync(wrappedTypescript);
  const stdout: string[] = [];
  const api = createScenario2Api();

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
    filename: "scenario2_code_mode.generated.js",
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

    const parsed = scenario2ResultSchema.parse(result);
    return { parsed, stdout };
  } catch (error) {
    throw new Scenario2CodeExecutionError(
      error instanceof Error ? error.message : String(error),
      stdout
    );
  }
}

export const executeScenario2Code = tool({
  name: "execute_scenario2_code",
  description:
    "Run model-written TypeScript for scenario 2 in a sandbox with restricted API methods getTargetSite() and auditSite({siteUrl?}). Return {siteUrl, findings, summary}.",
  inputSchema: executeCodeInputSchema,
  outputSchema: executeCodeOutputSchema,
  execute: async (input) => {
    const startedAt = Date.now();
    console.log("[Code Executor] Running scenario 2 model-generated TypeScript...");
    console.log(`[Code Executor] Code length: ${input.typescript.length} chars`);

    try {
      const outcome = await runUserCode(input.typescript);
      console.log(`[Code Executor] Success in ${Date.now() - startedAt}ms.`);

      lastScenario2Execution = {
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
        error instanceof Scenario2CodeExecutionError ? error.stdout : [];

      console.error(`[Code Executor] Failed in ${Date.now() - startedAt}ms.`);
      console.error(`[Code Executor] Reason: ${message}`);

      lastScenario2Execution = {
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
