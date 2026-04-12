import { tool } from "@openrouter/agent";
import { z } from "zod";
import { getScenario2ExpectedResult, SCENARIO2_SITE_URL } from "./data.js";
import { scenario2ResultSchema } from "./types.js";

export const auditDemoSite = tool({
  name: "audit_demo_site",
  description:
    "Audit the demo website and return structured UI/UX findings with severity and fixes.",
  inputSchema: z.object({
    siteUrl: z.url().default(SCENARIO2_SITE_URL),
  }),
  outputSchema: scenario2ResultSchema,
  execute: async (input) => {
    const baseline = getScenario2ExpectedResult();
    return {
      ...baseline,
      siteUrl: input.siteUrl,
    };
  },
});

export const benchmark2Tools = [auditDemoSite] as const;
