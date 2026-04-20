import {
  evaluateBenchmarkRun,
  type BenchmarkEvaluationSpec,
} from "../../lib/benchmark-evaluation.js";
import type { RegularToolStrategy } from "../../lib/benchmark-logger.js";
import { getScenario4ExpectedResult } from "./data.js";
import { scenario4ResultSchema } from "./types.js";

export const scenario4EvaluationSpec: BenchmarkEvaluationSpec = {
  benchmarkId: "4_drive_keyword_retrieval",
  expectedToolGroups: [
    {
      id: "progressive-discovery",
      anyOf: ["discover_tools"],
      required: true,
      note: "Agent should discover hidden tools first.",
    },
    {
      id: "keyword-retrieval",
      anyOf: ["retrieve_drive_keyword"],
      required: true,
      note: "Agent should retrieve keyword matches in regular mode.",
    },
  ],
  fuzzyResponseChecks: [
    {
      id: "result-fields",
      terms: ["query", "speaker", "date", "matches"],
      minMatches: 1,
      weight: 1,
    },
  ],
  minNumericMentions: 0,
};

export const scenario4CodeModeEvaluationSpec: BenchmarkEvaluationSpec = {
  ...scenario4EvaluationSpec,
  expectedToolGroups: [
    {
      id: "code-execution",
      anyOf: ["execute_scenario4_code"],
      required: true,
      note: "Code mode must write and execute code.",
    },
  ],
  minNumericMentions: 0,
};

const scenario4NoDiscoveryEvaluationSpec: BenchmarkEvaluationSpec = {
  ...scenario4EvaluationSpec,
  expectedToolGroups: scenario4EvaluationSpec.expectedToolGroups.filter(
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

export function evaluateScenario4Run(options: {
  mode: "regular" | "code-mode";
  calledToolNames: string[];
  finalText: string;
  regularToolStrategy?: RegularToolStrategy;
}) {
  const spec =
    options.mode === "code-mode"
      ? scenario4CodeModeEvaluationSpec
      : options.regularToolStrategy === "full-tool-context"
        ? scenario4NoDiscoveryEvaluationSpec
        : scenario4EvaluationSpec;

  const base = evaluateBenchmarkRun({
    calledToolNames: options.calledToolNames,
    finalText: options.finalText,
    spec,
  });

  const parsed = extractJsonObject(options.finalText);
  const schemaResult = parsed ? scenario4ResultSchema.safeParse(parsed) : null;
  const expected = getScenario4ExpectedResult();
  const parsedResult = schemaResult?.success ? schemaResult.data : null;
  const fileIds = new Set(parsedResult?.matches.map((match) => match.fileId) ?? []);

  const expectedEval = {
    pass:
      parsedResult?.query === expected.query &&
      parsedResult?.speaker === expected.speaker &&
      parsedResult?.date === expected.date &&
      expected.matches.every(
        (match) =>
          fileIds.has(match.fileId) &&
          parsedResult.matches.some(
            (candidate) =>
              candidate.fileId === match.fileId &&
              normalizeText(candidate.excerpt).includes(normalizeText(match.excerpt))
          )
      ),
    details: {
      queryPass: parsedResult?.query === expected.query,
      speakerPass: parsedResult?.speaker === expected.speaker,
      datePass: parsedResult?.date === expected.date,
      matchedFileIds: [...fileIds],
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
