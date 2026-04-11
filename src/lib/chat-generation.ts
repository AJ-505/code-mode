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

export type FreeModel = "openRouter/free";

export type Model = ProprietaryModel | OpenWeightModel | FreeModel;

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

export async function callTool() {}

export async function executeCode() {}
