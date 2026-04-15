import {
  evaluateBenchmarkRun,
  type BenchmarkEvaluationSpec,
} from "../../lib/benchmark-evaluation.js";
import { scenario5ResultSchema } from "./types.js";

export const scenario5EvaluationSpec: BenchmarkEvaluationSpec = {
  benchmarkId: "5_calendar_timezone_scheduling",
  expectedToolGroups: [
    {
      id: "progressive-discovery",
      anyOf: ["discover_tools"],
      required: true,
      note: "Agent should discover hidden tools first.",
    },
    {
      id: "slot-proposal",
      anyOf: ["propose_cross_timezone_slot"],
      required: true,
      note: "Agent should propose a timezone-safe meeting slot in regular mode.",
    },
  ],
  fuzzyResponseChecks: [
    {
      id: "result-fields",
      terms: [
        "proposedStartIso",
        "proposedEndIso",
        "localTimezone",
        "boliviaTimezone",
      ],
      minMatches: 1,
      weight: 1,
    },
  ],
  minNumericMentions: 0,
};

export const scenario5CodeModeEvaluationSpec: BenchmarkEvaluationSpec = {
  ...scenario5EvaluationSpec,
  expectedToolGroups: [
    {
      id: "code-execution",
      anyOf: ["execute_scenario5_code"],
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

export function evaluateScenario5Run(options: {
  mode: "regular" | "code-mode";
  calledToolNames: string[];
  finalText: string;
}) {
  const spec =
    options.mode === "code-mode"
      ? scenario5CodeModeEvaluationSpec
      : scenario5EvaluationSpec;

  const base = evaluateBenchmarkRun({
    calledToolNames: options.calledToolNames,
    finalText: options.finalText,
    spec,
  });

  const parsed = extractJsonObject(options.finalText);
  const schemaResult = parsed ? scenario5ResultSchema.safeParse(parsed) : null;

  return {
    ...base,
    schemaPass: schemaResult?.success === true,
    parsed: schemaResult?.success ? schemaResult.data : null,
    overallPass: base.overallPass && schemaResult?.success === true,
  };
}
