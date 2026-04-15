import { env } from "../../env.js";
import type { Model } from "../../lib/chat-generation.js";

export const scenario5BenchmarkId = "5_calendar_timezone_scheduling";
export const scenario5Number = 5;
export const defaultScenario5Model: Model = env.MODEL;
