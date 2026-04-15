import vm from "node:vm";
import { tool } from "@openrouter/agent";
import { z } from "zod";
import {
  getScenario5ExpectedResult,
  getScenario5SchedulingContext,
  SCENARIO5_BOLIVIA_TIMEZONE,
  SCENARIO5_LOCAL_TIMEZONE,
} from "./data.js";
import { scenario5ResultSchema } from "./types.js";

const schedulingContextSchema = z.object({
  localTimezone: z.string().min(1),
  boliviaTimezone: z.string().min(1),
  localWorkingHours: z.object({
    startHour24: z.number().int().min(0).max(23),
    endHour24: z.number().int().min(1).max(24),
  }),
  boliviaWorkingHours: z.object({
    startHour24: z.number().int().min(0).max(23),
    endHour24: z.number().int().min(1).max(24),
  }),
  localBusySlots: z.array(
    z.object({
      startIso: z.iso.datetime(),
      endIso: z.iso.datetime(),
    })
  ),
  boliviaBusySlots: z.array(
    z.object({
      startIso: z.iso.datetime(),
      endIso: z.iso.datetime(),
    })
  ),
});

const executeCodeInputSchema = z.object({
  typescript: z.string().min(1).max(20_000),
});

const executeCodeOutputSchema = z.object({
  ok: z.boolean(),
  result: scenario5ResultSchema.optional(),
  stdout: z.array(z.string()),
  error: z.string().optional(),
});

type Scenario5Api = {
  getSchedulingContext: () => Promise<z.infer<typeof schedulingContextSchema>>;
  proposeMeetingSlot: (input?: {
    localTimezone?: string;
    boliviaTimezone?: string;
  }) => Promise<z.infer<typeof scenario5ResultSchema>>;
};

type LastCodeExecution = {
  at: string;
  code: string;
  ok: boolean;
  result?: z.infer<typeof scenario5ResultSchema>;
  error?: string;
  stdout: string[];
};

let lastScenario5Execution: LastCodeExecution | null = null;

export function consumeLastScenario5CodeExecution() {
  const snapshot = lastScenario5Execution;
  lastScenario5Execution = null;
  return snapshot;
}

function createScenario5Api(): Scenario5Api {
  return {
    getSchedulingContext: async () => schedulingContextSchema.parse(getScenario5SchedulingContext()),
    proposeMeetingSlot: async (input) => {
      const baseline = getScenario5ExpectedResult();
      return {
        ...baseline,
        localTimezone: input?.localTimezone ?? SCENARIO5_LOCAL_TIMEZONE,
        boliviaTimezone: input?.boliviaTimezone ?? SCENARIO5_BOLIVIA_TIMEZONE,
      };
    },
  };
}

function normalizeModelCode(source: string) {
  return source.trim();
}

class Scenario5CodeExecutionError extends Error {
  readonly stdout: string[];

  constructor(message: string, stdout: string[]) {
    super(message);
    this.name = "Scenario5CodeExecutionError";
    this.stdout = stdout;
  }
}

async function runUserCode(typescript: string) {
  const source = normalizeModelCode(typescript);
  const wrappedTypescript = `async function __model_main() {\n${source}\n}\n__model_main();`;
  const transpiler = new Bun.Transpiler({ loader: "ts" });
  const javascript = transpiler.transformSync(wrappedTypescript);
  const stdout: string[] = [];
  const api = createScenario5Api();

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
    filename: "scenario5_code_mode.generated.js",
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

    const parsed = scenario5ResultSchema.parse(result);
    return { parsed, stdout };
  } catch (error) {
    throw new Scenario5CodeExecutionError(
      error instanceof Error ? error.message : String(error),
      stdout
    );
  }
}

export const executeScenario5Code = tool({
  name: "execute_scenario5_code",
  description:
    "Run model-written TypeScript for scenario 5 in a sandbox with restricted API methods getSchedulingContext() and proposeMeetingSlot({localTimezone?,boliviaTimezone?}). Return {proposedStartIso,proposedEndIso,localTimezone,boliviaTimezone,rationale}.",
  inputSchema: executeCodeInputSchema,
  outputSchema: executeCodeOutputSchema,
  execute: async (input) => {
    const startedAt = Date.now();
    console.log("[Code Executor] Running scenario 5 model-generated TypeScript...");
    console.log(`[Code Executor] Code length: ${input.typescript.length} chars`);

    try {
      const outcome = await runUserCode(input.typescript);
      console.log(`[Code Executor] Success in ${Date.now() - startedAt}ms.`);

      lastScenario5Execution = {
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
        error instanceof Scenario5CodeExecutionError ? error.stdout : [];

      console.error(`[Code Executor] Failed in ${Date.now() - startedAt}ms.`);
      console.error(`[Code Executor] Reason: ${message}`);

      lastScenario5Execution = {
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
