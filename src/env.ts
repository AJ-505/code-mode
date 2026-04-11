import * as Bun from "bun";
import { z } from "zod";

const envSchema = z.object({
  OPENROUTER_API_KEY: z.string().min(10),
  DATABASE_URL: z.string().min(10),
});

function validateEnvironmentVariables() {
  return envSchema.parse(Bun.env);
}

export const env = validateEnvironmentVariables();
