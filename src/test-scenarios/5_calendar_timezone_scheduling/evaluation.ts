import {
  evaluateBenchmarkRun,
  type BenchmarkEvaluationSpec,
} from "../../lib/benchmark-evaluation.js";
import type { RegularToolStrategy } from "../../lib/benchmark-logger.js";
import { getScenario5ExpectedResult } from "./data.js";
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

const scenario5NoDiscoveryEvaluationSpec: BenchmarkEvaluationSpec = {
  ...scenario5EvaluationSpec,
  expectedToolGroups: scenario5EvaluationSpec.expectedToolGroups.filter(
    (group) => group.id !== "progressive-discovery"
  ),
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

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1)) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  return null;
}

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function evaluateScenario5Run(options: {
  mode: "regular" | "code-mode";
  calledToolNames: string[];
  finalText: string;
  regularToolStrategy?: RegularToolStrategy;
}) {
  const spec =
    options.mode === "code-mode"
      ? scenario5CodeModeEvaluationSpec
      : options.regularToolStrategy === "full-tool-context"
        ? scenario5NoDiscoveryEvaluationSpec
        : scenario5EvaluationSpec;

  const base = evaluateBenchmarkRun({
    calledToolNames: options.calledToolNames,
    finalText: options.finalText,
    spec,
  });

  const parsed = extractJsonObject(options.finalText);
  const schemaResult = parsed ? scenario5ResultSchema.safeParse(parsed) : null;
  const expected = getScenario5ExpectedResult();
  const parsedResult = schemaResult?.success ? schemaResult.data : null;
  const rationaleText = normalizeText(parsedResult?.rationale ?? "");

  const expectedEval = {
    pass:
      parsedResult?.proposedStartIso === expected.proposedStartIso &&
      parsedResult?.proposedEndIso === expected.proposedEndIso &&
      parsedResult?.localTimezone === expected.localTimezone &&
      parsedResult?.boliviaTimezone === expected.boliviaTimezone &&
      rationaleText.includes("working hours") &&
      (rationaleText.includes("avoid") || rationaleText.includes("conflict")),
    details: {
      proposedStartPass: parsedResult?.proposedStartIso === expected.proposedStartIso,
      proposedEndPass: parsedResult?.proposedEndIso === expected.proposedEndIso,
      localTimezonePass: parsedResult?.localTimezone === expected.localTimezone,
      boliviaTimezonePass: parsedResult?.boliviaTimezone === expected.boliviaTimezone,
      rationalePass:
        rationaleText.includes("working hours") &&
        (rationaleText.includes("avoid") || rationaleText.includes("conflict")),
      expected,
    },
  };

  return {
    ...base,
    schemaPass: schemaResult?.success === true,
    parsed: parsedResult,
    expectedEval,
    overallPass:
      base.overallPass &&
      schemaResult?.success === true &&
      expectedEval.pass,
  };
}
