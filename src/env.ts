import * as Bun from "bun";
import { z } from "zod";

const envSchema = z.object({
  OPENROUTER_API_KEY: z.string(),
});

function validateEnvironmentVariables() {
  return envSchema.parse(Bun.env);
}

export const env = validateEnvironmentVariables();
