import { tool } from "@openrouter/agent";
import { z } from "zod";

export const discoverTools = tool({
	name: "discover_tools",
	description: `
    You have access to many additional tools that are not listed here.
    Available tool categories/groups: 
    - Date-Time tools (get_datetime)
    - Customer DB tools (search_products, get_product_details, compare_products)
    - Slack tools (fetch_slack_messages)
    - Github (fetch_issues, create_pr)
		- Google Calendar tools (get_calendar_events)
    
    Call this tool with the specific tool names you want to unlock.
    Only request tools you actually need for the current task.
  `,
	inputSchema: z.object({
		toolNames: z.array(z.string()).describe(
			"List of tool names to discover and activate",
		),
	}),
	execute: async ({ toolNames }) => {
		const discovered = toolNames.map(name => {
			const fullTool = allLazyToolsMap.get(name);
			if (!fullTool) return { error: `Tool ${name} not found` };
			return {
				name: fullTool.name,
				description: fullTool.description,
				inputSchema: fullTool.inputSchema, // or JSON schema
			};
		});

		return { discoveredTools: discovered };
	},
});

const allLazyToolsMap = new Map();
