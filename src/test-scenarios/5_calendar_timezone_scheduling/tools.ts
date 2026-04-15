import { tool } from "@openrouter/agent";
import { z } from "zod";
import {
  getScenario5ExpectedResult,
  SCENARIO5_BOLIVIA_TIMEZONE,
  SCENARIO5_LOCAL_TIMEZONE,
  SCENARIO5_REFERENCE_DATE,
} from "./data.js";
import { scenario5ResultSchema } from "./types.js";

export const proposeCrossTimezoneSlot = tool({
  name: "propose_cross_timezone_slot",
  description:
    "Propose a conflict-free meeting time between local timezone and Bolivia timezone within working hours.",
  inputSchema: z.object({
    date: z.string().min(1).default(SCENARIO5_REFERENCE_DATE),
    localTimezone: z.string().min(1).default(SCENARIO5_LOCAL_TIMEZONE),
    boliviaTimezone: z.string().min(1).default(SCENARIO5_BOLIVIA_TIMEZONE),
  }),
  outputSchema: scenario5ResultSchema,
  execute: async (input) => {
    const baseline = getScenario5ExpectedResult();
    return {
      ...baseline,
      localTimezone: input.localTimezone,
      boliviaTimezone: input.boliviaTimezone,
    };
  },
});

export const benchmark5Tools = [proposeCrossTimezoneSlot] as const;
