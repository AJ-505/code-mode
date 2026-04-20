import {
  evaluateBenchmarkRun,
  type BenchmarkEvaluationSpec,
} from "../../lib/benchmark-evaluation.js";
import type { RegularToolStrategy } from "../../lib/benchmark-logger.js";
import { getScenario3ExpectedResult } from "./data.js";
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

const scenario3NoDiscoveryEvaluationSpec: BenchmarkEvaluationSpec = {
  ...scenario3EvaluationSpec,
  expectedToolGroups: scenario3EvaluationSpec.expectedToolGroups.filter(
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

function normalizeScenario3ResultShape(value: Record<string, unknown>) {
  const fromIso =
    typeof value.fromIso === "string"
      ? value.fromIso
      : typeof (value.timeWindow as { fromIso?: unknown; from?: unknown } | undefined)
              ?.fromIso === "string"
        ? ((value.timeWindow as { fromIso?: string }).fromIso ?? "")
        : typeof (value.timeWindow as { fromIso?: unknown; from?: unknown } | undefined)
                ?.from === "string"
          ? ((value.timeWindow as { from?: string }).from ?? "")
        : "";

  const toIso =
    typeof value.toIso === "string"
      ? value.toIso
      : typeof (value.timeWindow as { toIso?: unknown; to?: unknown } | undefined)?.toIso ===
            "string"
        ? ((value.timeWindow as { toIso?: string }).toIso ?? "")
        : typeof (value.timeWindow as { toIso?: unknown; to?: unknown } | undefined)?.to ===
              "string"
          ? ((value.timeWindow as { to?: string }).to ?? "")
        : "";

  const topics = Array.isArray(value.topics)
    ? value.topics
    : Array.isArray(value.majorTopics)
      ? value.majorTopics
      : [];

  return {
    ...value,
    fromIso,
    toIso,
    topics,
  };
}

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function evaluateScenario3Run(options: {
  mode: "regular" | "code-mode";
  calledToolNames: string[];
  finalText: string;
  regularToolStrategy?: RegularToolStrategy;
}) {
  const spec =
    options.mode === "code-mode"
      ? scenario3CodeModeEvaluationSpec
      : options.regularToolStrategy === "full-tool-context"
        ? scenario3NoDiscoveryEvaluationSpec
        : scenario3EvaluationSpec;

  const base = evaluateBenchmarkRun({
    calledToolNames: options.calledToolNames,
    finalText: options.finalText,
    spec,
  });

  const parsed = extractJsonObject(options.finalText);
  const normalized = parsed ? normalizeScenario3ResultShape(parsed) : null;
  const schemaResult = normalized
    ? scenario3ResultSchema.safeParse(normalized)
    : null;
  const expected = getScenario3ExpectedResult();
  const parsedResult = schemaResult?.success ? schemaResult.data : null;

  const topicCoverage =
    parsedResult?.topics.filter((topic) => {
      const normalizedTopic = normalizeText(topic);
      return expected.topics.some((expectedTopic) =>
        normalizedTopic.includes(normalizeText(expectedTopic))
      );
    }).length ?? 0;

  const summaryText = normalizeText(parsedResult?.summary ?? "");
  const summaryPass =
    summaryText.includes("release") &&
    summaryText.includes("analytics") &&
    (summaryText.includes("ownership") || summaryText.includes("owner"));

  const actionItemsPass =
    parsedResult?.actionItems.some(
      (item) =>
        normalizeText(item.owner) === "avery" &&
        normalizeText(item.task).includes("analytics event naming mismatch")
    ) === true &&
    parsedResult?.actionItems.some(
      (item) =>
        normalizeText(item.owner) === "jordan" &&
        normalizeText(item.task).includes("rollout checklist")
    ) === true;

  const expectedEval = {
    pass:
      parsedResult?.channelId === expected.channelId &&
      summaryPass &&
      topicCoverage >= 2 &&
      actionItemsPass,
    details: {
      channelIdPass: parsedResult?.channelId === expected.channelId,
      summaryPass,
      topicCoverage,
      actionItemsPass,
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
