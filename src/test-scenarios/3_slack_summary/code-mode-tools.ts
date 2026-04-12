import vm from "node:vm";
import { tool } from "@openrouter/agent";
import { z } from "zod";
import { getScenario3ExpectedResult, SCENARIO3_CHANNEL_ID } from "./data.js";
import { scenario3ResultSchema } from "./types.js";

const executeCodeInputSchema = z.object({
  typescript: z.string().min(1).max(20_000),
});

const executeCodeOutputSchema = z.object({
  ok: z.boolean(),
  result: scenario3ResultSchema.optional(),
  stdout: z.array(z.string()),
  error: z.string().optional(),
});

type Scenario3Api = {
  getTargetChannel: () => Promise<{ channelId: string }>;
  summarizeChannel: (input?: {
    channelId?: string;
    fromIso?: string;
    toIso?: string;
  }) => Promise<z.infer<typeof scenario3ResultSchema>>;
};

type LastCodeExecution = {
  at: string;
  code: string;
  ok: boolean;
  result?: z.infer<typeof scenario3ResultSchema>;
  error?: string;
  stdout: string[];
};

let lastScenario3Execution: LastCodeExecution | null = null;

export function consumeLastScenario3CodeExecution() {
  const snapshot = lastScenario3Execution;
  lastScenario3Execution = null;
  return snapshot;
}

function createScenario3Api(): Scenario3Api {
  return {
    getTargetChannel: async () => ({ channelId: SCENARIO3_CHANNEL_ID }),
    summarizeChannel: async (input) => {
      const baseline = getScenario3ExpectedResult();
      return {
        ...baseline,
        channelId: input?.channelId ?? SCENARIO3_CHANNEL_ID,
        fromIso: input?.fromIso ?? baseline.fromIso,
        toIso: input?.toIso ?? baseline.toIso,
      };
    },
  };
}

function normalizeModelCode(source: string) {
  return source.trim();
}

class Scenario3CodeExecutionError extends Error {
  readonly stdout: string[];

  constructor(message: string, stdout: string[]) {
    super(message);
    this.name = "Scenario3CodeExecutionError";
    this.stdout = stdout;
  }
}

async function runUserCode(typescript: string) {
  const source = normalizeModelCode(typescript);
  const wrappedTypescript = `async function __model_main() {\n${source}\n}\n__model_main();`;
  const transpiler = new Bun.Transpiler({ loader: "ts" });
  const javascript = transpiler.transformSync(wrappedTypescript);
  const stdout: string[] = [];
  const api = createScenario3Api();

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
    filename: "scenario3_code_mode.generated.js",
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

    const parsed = scenario3ResultSchema.parse(result);
    return { parsed, stdout };
  } catch (error) {
    throw new Scenario3CodeExecutionError(
      error instanceof Error ? error.message : String(error),
      stdout
    );
  }
}

export const executeScenario3Code = tool({
  name: "execute_scenario3_code",
  description:
    "Run model-written TypeScript for scenario 3 in a sandbox with restricted API methods getTargetChannel() and summarizeChannel({channelId?,fromIso?,toIso?}). Return {channelId,fromIso,toIso,summary,topics,actionItems}.",
  inputSchema: executeCodeInputSchema,
  outputSchema: executeCodeOutputSchema,
  execute: async (input) => {
    const startedAt = Date.now();
    console.log("[Code Executor] Running scenario 3 model-generated TypeScript...");
    console.log(`[Code Executor] Code length: ${input.typescript.length} chars`);

    try {
      const outcome = await runUserCode(input.typescript);
      console.log(`[Code Executor] Success in ${Date.now() - startedAt}ms.`);

      lastScenario3Execution = {
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
        error instanceof Scenario3CodeExecutionError ? error.stdout : [];

      console.error(`[Code Executor] Failed in ${Date.now() - startedAt}ms.`);
      console.error(`[Code Executor] Reason: ${message}`);

      lastScenario3Execution = {
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
