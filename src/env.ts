import { z } from "zod";

const numberFromEnv = (defaultValue: number, schema: z.ZodNumber) =>
  z.preprocess((value) => {
    if (value === undefined || value === null || value === "") {
      return defaultValue;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : Number.NaN;
  }, schema);

export const envSchema = z.object({
  OPENROUTER_API_KEY: z.string().min(10),
  DATABASE_URL: z.string().min(10),
  BENCHMARK_MODEL_TIMEOUT_MS: numberFromEnv(240_000, z.number().int().positive()),
  MODEL: z.string().min(1).default("openrouter/free"),
  REGULAR_TOOL_STRATEGY: z
    .enum(["progressive-discovery", "full-tool-context"])
    .default("progressive-discovery"),
  CODE_MODE_TOOL_STRATEGY: z
    .enum(["full-api-context", "progressive-discovery"])
    .default("full-api-context"),
  INPUT_COST_PER_MILLION_USD: numberFromEnv(0, z.number().nonnegative()),
  OUTPUT_COST_PER_MILLION_USD: numberFromEnv(0, z.number().nonnegative()),
  CACHED_INPUT_COST_PER_MILLION_USD: numberFromEnv(0, z.number().nonnegative()),
});

const runtimeEnv =
  typeof Bun !== "undefined" ? Bun.env : (process.env as Record<string, string | undefined>);

function validateEnvironmentVariables() {
  return envSchema.parse(runtimeEnv);
}

export const env = validateEnvironmentVariables();
