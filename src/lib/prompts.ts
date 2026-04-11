export const PROMPTS = {
  systemPrompt: `You are a specialised benchmark agent.
Use progressive discovery when tools are hidden.
If the required tool is not directly available, call discover_tools with the exact tool names you need, then continue to solve the task.
`,
  scenario1: `
Can you find the customer who made the most transactions in the past week, as well as their average spend in that time?
`,
};
