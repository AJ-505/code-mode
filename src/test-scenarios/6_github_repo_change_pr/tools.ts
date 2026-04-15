import { tool } from "@openrouter/agent";
import { z } from "zod";
import {
  getScenario6ExpectedResult,
  SCENARIO6_REPO,
  SCENARIO6_REQUESTED_CHANGE,
} from "./data.js";
import { scenario6ResultSchema } from "./types.js";

export const simulateRepoChangeAndPr = tool({
  name: "simulate_repo_change_and_pr",
  description:
    "Simulate applying a requested repository change and returning pull request metadata.",
  inputSchema: z.object({
    repo: z.string().min(1).default(SCENARIO6_REPO),
    requestedChange: z.string().min(1).default(SCENARIO6_REQUESTED_CHANGE),
  }),
  outputSchema: scenario6ResultSchema,
  execute: async (input) => {
    const baseline = getScenario6ExpectedResult();
    return {
      ...baseline,
      repo: input.repo,
    };
  },
});

export const benchmark6Tools = [simulateRepoChangeAndPr] as const;
