import * as Bun from "bun";
import { z } from "zod";

const env = z.object({
	OPENROUTER_API_KEY: z.string(),
});


export function validateEnvironmentVariables() {
	return env.parse(Bun.env);
}
