import { env } from "../../env.js";
import type { Model } from "../../lib/chat-generation.js";

export const scenario4BenchmarkId = "4_drive_keyword_retrieval";
export const scenario4Number = 4;
export const defaultScenario4Model: Model = env.MODEL;
