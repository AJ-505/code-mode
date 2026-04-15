import { OpenRouter, toChatMessage } from "@openrouter/agent";
import { env } from "../env.js";

export type ChatMessage = {
  role: Role;
  content?: string;
};

export type ProprietaryModel =
  | "anthropic/claude-opus-4.6"
  | "openai/gpt-5.4"
  | "google/gemini-3.1-pro-preview";

export type OpenWeightModel =
  | "z-ai/glm-5.1"
  | "minimax/minimax-m2.7"
  | "moonshotai/kimi-k2.5";

export type FreeModel = "openrouter/free" | "google/gemma-4-26b-a4b-it:free";

export type Model = ProprietaryModel | OpenWeightModel | FreeModel | (string & {});

/**
Prompt hierarchy - Determines order of priority
*/
export type Role = "user" | "system" | "assistant" | "developer";

export const openrouter = new OpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

export async function generateResponse({
  prompt,
  model,
  role,
  chatHistory,
}: {
  prompt: string;
  model: Model;
  role: Role;
  chatHistory: ChatMessage[];
}) {
  const input = [...chatHistory, { role, content: prompt }];

  const modelResult = openrouter.callModel({
    model,
    input,
  });

  const openResponseResult = await modelResult.getResponse();
  const additionalMessage = toChatMessage(openResponseResult);
  const newHistory = [...input, additionalMessage];

  return {
    chatHistory: newHistory,
    modelResult,
  };
}

export async function callTool(toolName?: string, args?: unknown) {
  throw new Error(
    `callTool not implemented (toolName=${toolName ?? "unknown"}, argsProvided=${args !== undefined})`
  );
}

export async function executeCode(language?: string, code?: string) {
  throw new Error(
    `executeCode not implemented (language=${language ?? "unknown"}, codeLength=${typeof code === "string" ? code.length : 0})`
  );
}
