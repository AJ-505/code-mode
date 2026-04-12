import * as Bun from "bun";
import { randomUUID } from "node:crypto";
import type { Model } from "../../lib/chat-generation.js";

export const scenario1BenchmarkId = "1_customer_db_average_spend";
export const scenario1Number = 1;
export const defaultScenario1Model: Model = "openrouter/free";

export const modelCallTimeoutMs = Number(
  Bun.env.BENCHMARK_MODEL_TIMEOUT_MS ?? 120_000
);

export function createRunId() {
  return randomUUID().replaceAll("-", "").slice(0, 12);
}

export async function withTimeout<T>(
  stage: string,
  operation: Promise<T>,
  timeoutMs: number
) {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`Timeout while waiting for ${stage} after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([operation, timeoutPromise]);
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}

export function extractDiscoveredToolNames(
  calls: Array<{ name: string; arguments: unknown }>
) {
  return [...new Set(
    calls
      .filter((call) => call.name === "discover_tools")
      .flatMap((call) => {
        const args = call.arguments;
        if (typeof args !== "object" || args === null || !("toolNames" in args)) {
          return [];
        }

        const maybeToolNames = (args as { toolNames?: unknown }).toolNames;
        if (!Array.isArray(maybeToolNames)) return [];
        return maybeToolNames.filter(
          (name): name is string => typeof name === "string"
        );
      })
  )];
}
