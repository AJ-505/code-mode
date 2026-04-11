import { tool, type Tool } from "@openrouter/agent";
import { z } from "zod";

export const discoverTools = tool({
  name: "discover_tools",
  description: `
		You have access to hidden tools that can be progressively unlocked.
		For benchmark 1, discover tools in the Customer DB group.

		Example useful tool names for this benchmark:
    - get_current_datetime
    - get_all_customers
    - search_customers_by_name
    - list_transactions_in_window
    - compute_customer_spend_stats
    
    Call this tool with the specific tool names you want to unlock.
    Only request tools you actually need for the current task.
  `,
  inputSchema: z.object({
    toolNames: z
      .array(z.string())
      .describe("List of tool names to discover and activate"),
  }),
  execute: async ({ toolNames }) => {
    const discovered = toolNames.map((name) => {
      const fullTool = allLazyToolsMap.get(name);
      if (!fullTool) return { error: `Tool ${name} not found` };
      if (fullTool.type !== "function")
        return { error: `Tool ${name} is not callable` };

      return {
        name: fullTool.function.name,
        description: fullTool.function.description,
        inputSchema: fullTool.function.inputSchema,
      };
    });

    return { discoveredTools: discovered };
  },
});

const allLazyToolsMap = new Map<string, Tool>();

export function registerProgressiveTools(tools: Tool[]) {
  for (const nextTool of tools) {
    if (nextTool.type === "function") {
      allLazyToolsMap.set(nextTool.function.name, nextTool);
    }
  }
}

export function getProgressiveToolsByName(toolNames: string[]) {
  return toolNames
    .map((name) => allLazyToolsMap.get(name))
    .filter((tool): tool is Tool => tool !== undefined);
}

export function getAllRegisteredProgressiveToolNames() {
  return [...allLazyToolsMap.keys()];
}
