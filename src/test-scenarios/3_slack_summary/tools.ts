import { tool } from "@openrouter/agent";
import { z } from "zod";
import { getScenario3ExpectedResult, SCENARIO3_CHANNEL_ID } from "./data.js";
import { scenario3ResultSchema } from "./types.js";

export const summarizeSlackChannel = tool({
  name: "summarize_slack_channel",
  description:
    "Summarize Slack channel messages over a time window and extract topics and action items.",
  inputSchema: z.object({
    channelId: z.string().min(1).default(SCENARIO3_CHANNEL_ID),
    fromIso: z.iso.datetime().optional(),
    toIso: z.iso.datetime().optional(),
  }),
  outputSchema: scenario3ResultSchema,
  execute: async (input) => {
    const baseline = getScenario3ExpectedResult();
    return {
      ...baseline,
      channelId: input.channelId,
      fromIso: input.fromIso ?? baseline.fromIso,
      toIso: input.toIso ?? baseline.toIso,
    };
  },
});

export const benchmark3Tools = [summarizeSlackChannel] as const;
