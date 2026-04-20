import {
  evaluateBenchmarkRun,
  type BenchmarkEvaluationSpec,
} from "../../lib/benchmark-evaluation.js";
import type { RegularToolStrategy } from "../../lib/benchmark-logger.js";
import { getScenario6ExpectedResult } from "./data.js";
import { scenario6ResultSchema } from "./types.js";

export const scenario6EvaluationSpec: BenchmarkEvaluationSpec = {
  benchmarkId: "6_github_repo_change_pr",
  expectedToolGroups: [
    {
      id: "progressive-discovery",
      anyOf: ["discover_tools"],
      required: true,
      note: "Agent should discover hidden tools first.",
    },
    {
      id: "repo-change-pr",
      anyOf: ["simulate_repo_change_and_pr"],
      required: true,
      note: "Agent should simulate repo change and PR creation in regular mode.",
    },
  ],
  fuzzyResponseChecks: [
    {
      id: "result-fields",
      terms: ["repo", "changedFiles", "prTitle", "prUrl"],
      minMatches: 1,
      weight: 1,
    },
  ],
  minNumericMentions: 0,
};

export const scenario6CodeModeEvaluationSpec: BenchmarkEvaluationSpec = {
  ...scenario6EvaluationSpec,
  expectedToolGroups: [
    {
      id: "code-execution",
      anyOf: ["execute_scenario6_code"],
      required: true,
      note: "Code mode must write and execute code.",
    },
  ],
  minNumericMentions: 0,
};

const scenario6NoDiscoveryEvaluationSpec: BenchmarkEvaluationSpec = {
  ...scenario6EvaluationSpec,
  expectedToolGroups: scenario6EvaluationSpec.expectedToolGroups.filter(
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
      const blocks = [...text.matchAll(/```(?:json)?\s*([\s\S]*?)\s*```/gi)]
        .map((match) => match[1]?.trim())
        .filter((value): value is string => Boolean(value));

      if (blocks.length >= 2) {
        try {
          const first = JSON.parse(blocks[0] as string) as unknown;
          const second = JSON.parse(blocks[1] as string) as unknown;

          if (
            Array.isArray(first) &&
            typeof second === "object" &&
            second !== null
          ) {
            return {
              changedFiles: first,
              ...(second as Record<string, unknown>),
            };
          }
        } catch {
          return null;
        }
      }

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

function normalizeScenario6ResultShape(value: Record<string, unknown>) {
  const pr =
    typeof value.pr === "object" && value.pr !== null
      ? (value.pr as Record<string, unknown>)
      : null;

  return {
    repo:
      typeof value.repo === "string"
        ? value.repo
        : typeof pr?.repo === "string"
          ? pr.repo
          : "",
    branch:
      typeof value.branch === "string"
        ? value.branch
        : typeof pr?.branch === "string"
          ? pr.branch
          : "",
    changedFiles: Array.isArray(value.changedFiles) ? value.changedFiles : [],
    prTitle:
      typeof value.prTitle === "string"
        ? value.prTitle
        : typeof pr?.title === "string"
          ? pr.title
          : "",
    prBody:
      typeof value.prBody === "string"
        ? value.prBody
        : typeof pr?.body === "string"
          ? pr.body
          : "",
    prUrl:
      typeof value.prUrl === "string"
        ? value.prUrl
        : typeof pr?.url === "string"
          ? pr.url
          : "",
  };
}

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function evaluateScenario6Run(options: {
  mode: "regular" | "code-mode";
  calledToolNames: string[];
  finalText: string;
  regularToolStrategy?: RegularToolStrategy;
}) {
  const spec =
    options.mode === "code-mode"
      ? scenario6CodeModeEvaluationSpec
      : options.regularToolStrategy === "full-tool-context"
        ? scenario6NoDiscoveryEvaluationSpec
        : scenario6EvaluationSpec;

  const base = evaluateBenchmarkRun({
    calledToolNames: options.calledToolNames,
    finalText: options.finalText,
    spec,
  });

  const parsed = extractJsonObject(options.finalText);
  const normalized = parsed ? normalizeScenario6ResultShape(parsed) : null;
  const schemaResult = normalized ? scenario6ResultSchema.safeParse(normalized) : null;
  const expected = getScenario6ExpectedResult();
  const parsedResult = schemaResult?.success ? schemaResult.data : null;

  const expectedEval = {
    pass:
      parsedResult?.repo === expected.repo &&
      parsedResult?.branch === expected.branch &&
      parsedResult?.prTitle === expected.prTitle &&
      parsedResult?.prUrl === expected.prUrl &&
      parsedResult?.changedFiles.some(
        (file) =>
          file.path === "README.md" &&
          normalizeText(file.changeSummary).includes("clarified benchmark run command formatting")
      ) === true &&
      normalizeText(parsedResult?.prBody ?? "").includes(
        normalizeText("clarify benchmark execution command")
      ),
    details: {
      repoPass: parsedResult?.repo === expected.repo,
      branchPass: parsedResult?.branch === expected.branch,
      prTitlePass: parsedResult?.prTitle === expected.prTitle,
      prUrlPass: parsedResult?.prUrl === expected.prUrl,
      changedFilesPass:
        parsedResult?.changedFiles.some(
          (file) =>
            file.path === "README.md" &&
            normalizeText(file.changeSummary).includes("clarified benchmark run command formatting")
        ) === true,
      prBodyPass: normalizeText(parsedResult?.prBody ?? "").includes(
        normalizeText("clarify benchmark execution command")
      ),
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
