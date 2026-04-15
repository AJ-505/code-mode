import { env } from "../../env.js";
import type { Model } from "../../lib/chat-generation.js";

export const scenario3BenchmarkId = "3_slack_summary";
export const scenario3Number = 3;
export const defaultScenario3Model: Model = env.MODEL;
