import { validateEnvironmentVariables } from "./env.js";
import { generateResponse } from "./paradigms/code-mode.js";
validateEnvironmentVariables();

const SYSTEM_PROMPT =
	`You are a specialised agent built to take different tests on various tasks.
You have access to the following tools:

# 1. Google Drive
Available tools:

`;

const initialResponse = await generateResponse({
	model: "openRouter/free",
	prompt: SYSTEM_PROMPT,
	role: "user",
});

console.log(initialResponse.choices[0]?.message);
