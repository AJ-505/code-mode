import { env } from "../../env.js";
import type { Model } from "../../lib/chat-generation.js";

export const scenario2BenchmarkId = "2_playwright_ui_audit";
export const scenario2Number = 2;
export const defaultScenario2Model: Model = env.MODEL;
