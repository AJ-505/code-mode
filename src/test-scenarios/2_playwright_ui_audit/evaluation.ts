import {
  evaluateBenchmarkRun,
  type BenchmarkEvaluationSpec,
} from "../../lib/benchmark-evaluation.js";
import { scenario2ResultSchema } from "./types.js";

export const scenario2EvaluationSpec: BenchmarkEvaluationSpec = {
  benchmarkId: "2_playwright_ui_audit",
  expectedToolGroups: [
    {
      id: "progressive-discovery",
      anyOf: ["discover_tools"],
      required: true,
      note: "Agent should discover hidden tools first.",
    },
    {
      id: "site-inspection",
      anyOf: ["audit_demo_site"],
      required: true,
      note: "Agent should run website audit tool in regular mode.",
    },
  ],
  fuzzyResponseChecks: [
    {
      id: "finding-mention",
      terms: ["findings", "severity", "suggestedFix"],
      minMatches: 1,
      weight: 1,
    },
  ],
  minNumericMentions: 0,
};

export const scenario2CodeModeEvaluationSpec: BenchmarkEvaluationSpec = {
  ...scenario2EvaluationSpec,
  expectedToolGroups: [
    {
      id: "code-execution",
      anyOf: ["execute_scenario2_code"],
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

export function evaluateScenario2Run(options: {
  mode: "regular" | "code-mode";
  calledToolNames: string[];
  finalText: string;
}) {
  const spec =
    options.mode === "code-mode"
      ? scenario2CodeModeEvaluationSpec
      : scenario2EvaluationSpec;

  const base = evaluateBenchmarkRun({
    calledToolNames: options.calledToolNames,
    finalText: options.finalText,
    spec,
  });

  const parsed = extractJsonObject(options.finalText);
  const schemaResult = parsed ? scenario2ResultSchema.safeParse(parsed) : null;

  return {
    ...base,
    schemaPass: schemaResult?.success === true,
    parsed: schemaResult?.success ? schemaResult.data : null,
    overallPass: base.overallPass && schemaResult?.success === true,
  };
}
