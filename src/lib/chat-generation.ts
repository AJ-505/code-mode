import { OpenRouter } from "@openrouter/agent";
import { env } from "../env.js";

type ProprietaryModel =
	| "anthropic/claude-opus-4.6"
	| "openai/gpt-5.4"
	| "google/gemini-3.1-pro-preview";

type OpenWeightModel =
	| "z-ai/glm-5.1"
	| "minimax/minimax-m2.7"
	| "moonshotai/kimi-k2.5";

type FreeModel = "openRouter/free";

type Model = ProprietaryModel | OpenWeightModel | FreeModel;

/**
Prompt hierarchy - Determines order of priority
*/
type Role = "user" | "system";

export const client = new OpenRouter({
	apiKey: env.OPENROUTER_API_KEY,
});

export async function generateResponse(
	{ prompt, model, role }: { prompt: string; model: Model; role: Role },
) {
	const response = await client.callModel({
		model,
		input: [
			{ role, content: prompt },
		],
	});
	return response;
}

export async function callTool() {
}

export async function executeCode() { }
