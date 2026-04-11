import { generateResponse, type Model } from "../../lib/chat-generation.js";
import { PROMPTS } from "../../lib/prompts.js";

const model: Model = "openRouter/free";

let { chatHistory } = await generateResponse({
	model,
	prompt: PROMPTS.sytemPrompt,
	role: "user",
	chatHistory: [],
});

await generateResponse({
	model,
	prompt: PROMPTS.scenario1,
	role: "user",
	chatHistory: chatHistory,
});
// const response = await generateResponse({
// 	model: "openRouter/free",
// 	role: "system",
// 	prompt: PROMPTS.scenario1,
// });
//
