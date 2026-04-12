import { tool } from "@openrouter/agent";
import { z } from "zod";
import {
  getScenario4ExpectedResult,
  SCENARIO4_DEFAULT_DATE,
  SCENARIO4_DEFAULT_QUERY,
  SCENARIO4_DEFAULT_SPEAKER,
} from "./data.js";
import { scenario4ResultSchema } from "./types.js";

export const retrieveDriveKeyword = tool({
  name: "retrieve_drive_keyword",
  description:
    "Retrieve meeting-note excerpts where a target speaker used a target keyword on a target date.",
  inputSchema: z.object({
    query: z.string().min(1).default(SCENARIO4_DEFAULT_QUERY),
    speaker: z.string().min(1).default(SCENARIO4_DEFAULT_SPEAKER),
    date: z.string().min(1).default(SCENARIO4_DEFAULT_DATE),
  }),
  outputSchema: scenario4ResultSchema,
  execute: async (input) => {
    const baseline = getScenario4ExpectedResult();
    return {
      ...baseline,
      query: input.query,
      speaker: input.speaker,
      date: input.date,
    };
  },
});

export const benchmark4Tools = [retrieveDriveKeyword] as const;
