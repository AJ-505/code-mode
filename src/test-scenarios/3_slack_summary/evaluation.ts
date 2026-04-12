import {
  evaluateBenchmarkRun,
  type BenchmarkEvaluationSpec,
} from "../../lib/benchmark-evaluation.js";
import { scenario3ResultSchema } from "./types.js";

export const scenario3EvaluationSpec: BenchmarkEvaluationSpec = {
  benchmarkId: "3_slack_summary",
  expectedToolGroups: [
    {
      id: "progressive-discovery",
      anyOf: ["discover_tools"],
      required: true,
      note: "Agent should discover hidden tools first.",
    },
    {
      id: "channel-summary",
      anyOf: ["summarize_slack_channel"],
      required: true,
      note: "Agent should summarize channel messages in regular mode.",
    },
  ],
  fuzzyResponseChecks: [
    {
      id: "summary-fields",
      terms: ["summary", "topics", "actionItems"],
      minMatches: 1,
      weight: 1,
    },
  ],
  minNumericMentions: 0,
};

export const scenario3CodeModeEvaluationSpec: BenchmarkEvaluationSpec = {
  ...scenario3EvaluationSpec,
  expectedToolGroups: [
    {
      id: "code-execution",
      anyOf: ["execute_scenario3_code"],
      required: true,
      note: "Code mode must write and execute code.",
    },
  ],
  minNumericMentions: 0,
};

function extractJsonObject(text: string): Record<string, unknown> | null {
  const trimmed = text.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      return JSON.parse(trimmed) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  const blockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (blockMatch?.[1]) {
    try {
      return JSON.parse(blockMatch[1]) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  return null;
}

export function evaluateScenario3Run(options: {
  mode: "regular" | "code-mode";
  calledToolNames: string[];
  finalText: string;
}) {
  const spec =
    options.mode === "code-mode"
      ? scenario3CodeModeEvaluationSpec
      : scenario3EvaluationSpec;

  const base = evaluateBenchmarkRun({
    calledToolNames: options.calledToolNames,
    finalText: options.finalText,
    spec,
  });

  const parsed = extractJsonObject(options.finalText);
  const schemaResult = parsed ? scenario3ResultSchema.safeParse(parsed) : null;

  return {
    ...base,
    schemaPass: schemaResult?.success === true,
    parsed: schemaResult?.success ? schemaResult.data : null,
    overallPass: base.overallPass && schemaResult?.success === true,
  };
}
