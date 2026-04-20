import {
  evaluateBenchmarkRun,
  type BenchmarkEvaluationSpec,
} from "../../lib/benchmark-evaluation.js";
import type { RegularToolStrategy } from "../../lib/benchmark-logger.js";
import { getScenario2ExpectedResult } from "./data.js";
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

const scenario2NoDiscoveryEvaluationSpec: BenchmarkEvaluationSpec = {
  ...scenario2EvaluationSpec,
  expectedToolGroups: scenario2EvaluationSpec.expectedToolGroups.filter(
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

function normalizeScenario2ResultShape(value: Record<string, unknown>) {
  const findings = Array.isArray(value.findings) ? value.findings : [];

  return {
    ...value,
    findings: findings.map((entry) => {
      if (typeof entry !== "object" || entry === null) return entry;
      const finding = entry as Record<string, unknown>;
      const description =
        typeof finding.description === "string" && finding.description.trim().length > 0
          ? finding.description
          : Array.isArray(finding.reproSteps)
            ? finding.reproSteps.filter((step) => typeof step === "string").join(" ")
            : "";

      return {
        ...finding,
        description,
      };
    }),
  };
}

export function evaluateScenario2Run(options: {
  mode: "regular" | "code-mode";
  calledToolNames: string[];
  finalText: string;
  regularToolStrategy?: RegularToolStrategy;
}) {
  const spec =
    options.mode === "code-mode"
      ? scenario2CodeModeEvaluationSpec
      : options.regularToolStrategy === "full-tool-context"
        ? scenario2NoDiscoveryEvaluationSpec
        : scenario2EvaluationSpec;

  const base = evaluateBenchmarkRun({
    calledToolNames: options.calledToolNames,
    finalText: options.finalText,
    spec,
  });

  const parsed = extractJsonObject(options.finalText);
  const normalized = parsed ? normalizeScenario2ResultShape(parsed) : null;
  const schemaResult = normalized
    ? scenario2ResultSchema.safeParse(normalized)
    : null;
  const expected = getScenario2ExpectedResult();
  const parsedResult = schemaResult?.success ? schemaResult.data : null;

  const summaryText = normalizeText(parsedResult?.summary ?? "");
  const summaryPass =
    summaryText.includes("hierarchy") &&
    (summaryText.includes("accessibility") || summaryText.includes("focus"));

  const hasHierarchyFinding =
    parsedResult?.findings.some((finding) => {
      const haystack = normalizeText(
        `${finding.title} ${finding.description} ${finding.suggestedFix}`
      );
      return finding.severity === "medium" && haystack.includes("hierarchy");
    }) ?? false;

  const hasFocusFinding =
    parsedResult?.findings.some((finding) => {
      const haystack = normalizeText(
        `${finding.title} ${finding.description} ${finding.suggestedFix}`
      );
      return finding.severity === "low" && haystack.includes("focus");
    }) ?? false;

  const expectedEval = {
    pass:
      parsedResult?.siteUrl === expected.siteUrl &&
      summaryPass &&
      hasHierarchyFinding &&
      hasFocusFinding,
    details: {
      siteUrlPass: parsedResult?.siteUrl === expected.siteUrl,
      summaryPass,
      hasHierarchyFinding,
      hasFocusFinding,
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
