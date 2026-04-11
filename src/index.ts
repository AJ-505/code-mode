import { PROMPTS } from "./lib/prompts.js";
import { generateResponse } from "./paradigms/code-mode.js";

const initialResponse = await generateResponse({
	model: "openRouter/free",
	prompt: PROMPTS.sytemPrompt,
	role: "user",
});

console.log(initialResponse.choices[0]?.message);
