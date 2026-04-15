import vm from "node:vm";
import { tool } from "@openrouter/agent";
import { z } from "zod";
import {
  getScenario6ExpectedResult,
  getScenario6RepoContext,
  SCENARIO6_DEFAULT_BRANCH,
  SCENARIO6_REPO,
} from "./data.js";
import { scenario6ResultSchema } from "./types.js";

const repoTaskSchema = z.object({
  repo: z.string().min(1),
  defaultBranch: z.string().min(1),
  requestedChange: z.string().min(1),
});

const executeCodeInputSchema = z.object({
  typescript: z.string().min(1).max(20_000),
});

const executeCodeOutputSchema = z.object({
  ok: z.boolean(),
  result: scenario6ResultSchema.optional(),
  stdout: z.array(z.string()),
  error: z.string().optional(),
});

type Scenario6Api = {
  getRepoTask: () => Promise<z.infer<typeof repoTaskSchema>>;
  applyRepoChange: (input?: {
    repo?: string;
    branch?: string;
  }) => Promise<z.infer<typeof scenario6ResultSchema>>;
};

type LastCodeExecution = {
  at: string;
  code: string;
  ok: boolean;
  result?: z.infer<typeof scenario6ResultSchema>;
  error?: string;
  stdout: string[];
};

let lastScenario6Execution: LastCodeExecution | null = null;

export function consumeLastScenario6CodeExecution() {
  const snapshot = lastScenario6Execution;
  lastScenario6Execution = null;
  return snapshot;
}

function createScenario6Api(): Scenario6Api {
  return {
    getRepoTask: async () => repoTaskSchema.parse(getScenario6RepoContext()),
    applyRepoChange: async (input) => {
      const baseline = getScenario6ExpectedResult();
      return {
        ...baseline,
        repo: input?.repo ?? SCENARIO6_REPO,
        branch: input?.branch ?? SCENARIO6_DEFAULT_BRANCH,
      };
    },
  };
}

function normalizeModelCode(source: string) {
  return source.trim();
}

class Scenario6CodeExecutionError extends Error {
  readonly stdout: string[];

  constructor(message: string, stdout: string[]) {
    super(message);
    this.name = "Scenario6CodeExecutionError";
    this.stdout = stdout;
  }
}

async function runUserCode(typescript: string) {
  const source = normalizeModelCode(typescript);
  const wrappedTypescript = `async function __model_main() {\n${source}\n}\n__model_main();`;
  const transpiler = new Bun.Transpiler({ loader: "ts" });
  const javascript = transpiler.transformSync(wrappedTypescript);
  const stdout: string[] = [];
  const api = createScenario6Api();

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
    filename: "scenario6_code_mode.generated.js",
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

    const parsed = scenario6ResultSchema.parse(result);
    return { parsed, stdout };
  } catch (error) {
    throw new Scenario6CodeExecutionError(
      error instanceof Error ? error.message : String(error),
      stdout
    );
  }
}

export const executeScenario6Code = tool({
  name: "execute_scenario6_code",
  description:
    "Run model-written TypeScript for scenario 6 in a sandbox with restricted API methods getRepoTask() and applyRepoChange({repo?,branch?}). Return {repo,branch,changedFiles,prTitle,prBody,prUrl}.",
  inputSchema: executeCodeInputSchema,
  outputSchema: executeCodeOutputSchema,
  execute: async (input) => {
    const startedAt = Date.now();
    console.log("[Code Executor] Running scenario 6 model-generated TypeScript...");
    console.log(`[Code Executor] Code length: ${input.typescript.length} chars`);

    try {
      const outcome = await runUserCode(input.typescript);
      console.log(`[Code Executor] Success in ${Date.now() - startedAt}ms.`);

      lastScenario6Execution = {
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
        error instanceof Scenario6CodeExecutionError ? error.stdout : [];

      console.error(`[Code Executor] Failed in ${Date.now() - startedAt}ms.`);
      console.error(`[Code Executor] Reason: ${message}`);

      lastScenario6Execution = {
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
