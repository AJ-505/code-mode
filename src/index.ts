import { generateResponse } from "./paradigms/code-mode.js";

const SYSTEM_PROMPT =
	`You are a specialised agent built to take different tests on various tasks.
You have access to the following tools:

Available tools:

`;

const initialResponse = await generateResponse({
	model: "openRouter/free",
	prompt: SYSTEM_PROMPT,
	role: "user",
});

console.log(initialResponse.choices[0]?.message);
