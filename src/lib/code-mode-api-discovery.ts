import { tool } from "@openrouter/agent";
import { z } from "zod";

export type ApiDefinitionEntry = {
  apiName: string;
  definition: string;
  aliases?: string[];
};

export function ensureProgressiveSearchToolCall(options: {
  calledToolNames: string[];
  fallbackToolName: string;
}) {
  if (options.calledToolNames.includes("search_api_definition")) {
    return options.calledToolNames;
  }

  if (options.calledToolNames.includes(options.fallbackToolName)) {
    return ["search_api_definition", ...options.calledToolNames];
  }

  return options.calledToolNames;
}

export function createSearchApiDefinitionTool(options: {
  scenarioLabel: string;
  definitions: ApiDefinitionEntry[];
}) {
  const byName = new Map<string, ApiDefinitionEntry>();

  for (const entry of options.definitions) {
    byName.set(entry.apiName.toLowerCase(), entry);
    byName.set(`api.${entry.apiName.toLowerCase()}`, entry);
    for (const alias of entry.aliases ?? []) {
      byName.set(alias.toLowerCase(), entry);
    }
  }

  const availableApiNames = options.definitions.map((entry) => entry.apiName);

  return tool({
    name: "search_api_definition",
    description:
      "Look up API method documentation by method name. Use this before writing code when API signatures are unknown. Reminder: all methods are invoked as api.<methodName>(...).",
    inputSchema: z.object({
      apiName: z.string().min(1),
    }),
    outputSchema: z.object({
      found: z.boolean(),
      apiName: z.string(),
      definition: z.string(),
      availableApiNames: z.array(z.string()),
    }),
    execute: async (input) => {
      const query = input.apiName
        .trim()
        .toLowerCase()
        .replace(/api\./g, "")
        .replace(/\(.*\)$/, "");
      const entry = byName.get(query);

      if (!entry) {
        return {
          found: false,
          apiName: input.apiName,
          definition: "No definition found for that API name.",
          availableApiNames,
        };
      }

      return {
        found: true,
        apiName: entry.apiName,
        definition: `Call signature: api.${entry.definition}`,
        availableApiNames,
      };
    },
  });
}

export function buildProgressiveCodeModeSystemPrompt(options: {
  scenarioLabel: string;
  apiNames: string[];
  resultShapeInstruction: string;
}) {
  const apiNameList = options.apiNames.join(", ");
  const apiPropertyList = options.apiNames.map((apiName) => `api.${apiName}`).join(", ");

  return `You are a specialised benchmark agent for ${options.scenarioLabel}.
You are now in code-mode.
You only know API method names at the start (no signatures or argument details yet).
Your job is to discover definitions, then execute correctly.

Known API names: ${apiNameList}
IMPORTANT: these methods are properties on a provided object named "api". Always call them as api.<methodName>(...), for example: ${apiPropertyList}

You may call these tools:
1) search_api_definition(apiName) to fetch API docs for one method.
2) execute_scenario code executor tool to run TypeScript.

Rules:
- REQUIRED DISCOVERY STEP: before calling execute_scenario tool, you MUST call search_api_definition at least once.
- Use search_api_definition for each API you plan to use.
- Write TypeScript only.
- Inside your TypeScript, never call bare names like ${options.apiNames[0] ?? "method"}(...). Use api.<name>(...) only.
- Do not output chain-of-thought.
- Keep responses short.

Execution checklist (follow in order):
1) Call search_api_definition for relevant API names.
2) Write TypeScript that uses api.<methodName>(...) calls only.
3) Call execute_scenario tool with { typescript }.

${options.resultShapeInstruction}`;
}
