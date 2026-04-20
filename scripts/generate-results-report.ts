import * as Bun from "bun";

type BenchmarkMode = "regular" | "code-mode";
type RegularToolStrategy = "progressive-discovery" | "full-tool-context";
type ParadigmKey =
  | "regular-progressive"
  | "regular-full-tool-context"
  | "code-mode";

type BenchmarkJsonLog = {
  benchmarkId?: string;
  scenarioNumber: number;
  mode: BenchmarkMode;
  regularToolStrategy?: RegularToolStrategy;
  model: string;
  pairId?: string;
  runId?: string;
  runStartedAt: string;
  runFinishedAt?: string;
  status: "passed" | "failed";
  didFailTest: boolean;
  error?: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    cachedTokens?: number;
    totalTokens: number;
    estimatedCostUsd: number;
  };
  modelResponses?: Array<unknown>;
  events?: Array<{
    ts?: string;
    level?: "info" | "error";
    event?: string;
    message?: string;
    data?: Record<string, unknown>;
  }>;
  evaluation?: Record<string, unknown>;
};

type PricingConfig = {
  inputPerMillionUsd: number;
  outputPerMillionUsd: number;
  cachedInputPerMillionUsd: number;
};

type EnrichedRun = {
  path: string;
  log: BenchmarkJsonLog;
  paradigm: ParadigmKey;
  recomputedCostUsd: number;
  recomputedCostNgn: number;
  apiCalls: number;
  outcome: "passed" | "non_model_failure" | "benchmark_or_model_failure";
  finishedAtMs: number;
  issueSummary: string;
};

type OfficialFxRate = {
  ngnPerUsd: number;
  dateLabel: string;
  sourceLabel: string;
};

const TOTAL_SCENARIOS = 6;

const CANONICAL_PRICING: Record<string, PricingConfig> = {
  "anthropic/claude-opus-4.6": {
    inputPerMillionUsd: 2.5,
    outputPerMillionUsd: 15,
    cachedInputPerMillionUsd: 0,
  },
  "anthropic/claude-sonnet-4.6": {
    inputPerMillionUsd: 2.5,
    outputPerMillionUsd: 15,
    cachedInputPerMillionUsd: 0,
  },
  "google/gemini-3.1-pro-preview": {
    inputPerMillionUsd: 2.5,
    outputPerMillionUsd: 15,
    cachedInputPerMillionUsd: 0,
  },
  "google/gemini-3.1-flash-lite-preview": {
    inputPerMillionUsd: 0.25,
    outputPerMillionUsd: 1.5,
    cachedInputPerMillionUsd: 0,
  },
  "moonshotai/kimi-k2.5": {
    inputPerMillionUsd: 0.3827,
    outputPerMillionUsd: 1.72,
    cachedInputPerMillionUsd: 0,
  },
  "openai/gpt-5.4": {
    inputPerMillionUsd: 2.5,
    outputPerMillionUsd: 15,
    cachedInputPerMillionUsd: 0,
  },
  "openai/gpt-5.4-mini": {
    inputPerMillionUsd: 0.75,
    outputPerMillionUsd: 4.5,
    cachedInputPerMillionUsd: 0,
  },
  "z-ai/glm-5.1": {
    inputPerMillionUsd: 0.3827,
    outputPerMillionUsd: 1.72,
    cachedInputPerMillionUsd: 0,
  },
};

const INCLUDED_MODELS = Object.keys(CANONICAL_PRICING);

const PARADIGM_ORDER: ParadigmKey[] = [
  "regular-progressive",
  "regular-full-tool-context",
  "code-mode",
];

const PARADIGM_LABEL: Record<ParadigmKey, string> = {
  "regular-progressive": "Regular (with progressive discovery)",
  "regular-full-tool-context": "Regular (without progressive discovery)",
  "code-mode": "Code Mode",
};

function sanitizeLabel(value: string) {
  return value.replaceAll(/[^a-zA-Z0-9_.-]/g, "_");
}

function estimateCostUsd(log: BenchmarkJsonLog) {
  const pricing = CANONICAL_PRICING[log.model];
  if (!pricing) return 0;

  return Number(
    (
      (log.usage.inputTokens / 1_000_000) * pricing.inputPerMillionUsd +
      (log.usage.outputTokens / 1_000_000) * pricing.outputPerMillionUsd
    ).toFixed(6)
  );
}

function toNgn(usd: number, ngnPerUsd: number) {
  return Number((usd * ngnPerUsd).toFixed(2));
}

function formatInt(value: number) {
  return value.toLocaleString("en-US");
}

function formatPercent(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "n/a";
  return `${(value * 100).toFixed(1)}%`;
}

function formatNgn(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "n/a";
  return `₦${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatUsd(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "n/a";
  return `$${value.toFixed(6)}`;
}

function formatRate(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "n/a";
  return value.toFixed(2);
}

function formatScenarioSet(values: number[]) {
  return values.length === 0 ? "none" : values.sort((a, b) => a - b).join(",");
}

function parseCbnDate(value: string) {
  return Date.parse(value.replace(/-/g, " "));
}

async function fetchOfficialFxRate(): Promise<OfficialFxRate> {
  const response = await fetch("https://www.cbn.gov.ng/api/GetAllNFEM_RatesGRAPH");
  if (!response.ok) {
    throw new Error(`CBN FX API returned ${response.status}`);
  }

  const rows = (await response.json()) as Array<{
    ratedate?: string;
    weightedAvgRate?: string;
  }>;

  const parsed = rows
    .map((row) => ({
      ratedate: row.ratedate ?? "",
      ngnPerUsd: Number(row.weightedAvgRate ?? NaN),
      ratedAtMs: parseCbnDate(row.ratedate ?? ""),
    }))
    .filter(
      (row) =>
        row.ratedate.length > 0 &&
        Number.isFinite(row.ngnPerUsd) &&
        Number.isFinite(row.ratedAtMs)
    )
    .sort((a, b) => b.ratedAtMs - a.ratedAtMs);

  const latest = parsed[0];
  if (!latest) {
    throw new Error("CBN FX API returned no valid NFEM rows");
  }

  return {
    ngnPerUsd: latest.ngnPerUsd,
    dateLabel: latest.ratedate,
    sourceLabel:
      "Central Bank of Nigeria NFEM weighted average rate (official daily rate)",
  };
}

function getParadigm(log: BenchmarkJsonLog): ParadigmKey {
  if (log.mode === "code-mode") return "code-mode";
  return log.regularToolStrategy === "full-tool-context"
    ? "regular-full-tool-context"
    : "regular-progressive";
}

function classifyOutcome(log: BenchmarkJsonLog): EnrichedRun["outcome"] {
  if (!log.didFailTest) return "passed";

  const errorText = [
    log.error,
    ...(log.events ?? [])
      .filter((event) => event.level === "error")
      .flatMap((event) => [
        event.message,
        typeof event.data?.error === "string" ? event.data.error : undefined,
      ]),
  ]
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .join(" ");

  if (
    /unable to connect|provider returned error|internal stream ended unexpectedly|socket connection closed unexpectedly|certificate verification error|invalid model id|timeout while waiting .*response|no tool output found for function call|http client error/i.test(
      errorText
    )
  ) {
    return "non_model_failure";
  }

  return "benchmark_or_model_failure";
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function issueSummaryFromEvaluation(evaluation: Record<string, unknown> | null) {
  if (!evaluation) return "";

  const reasons: string[] = [];
  const toolEval = asRecord(evaluation.toolEval);
  const details = Array.isArray(toolEval?.details) ? toolEval.details : [];
  const missingGroups = details
    .map((detail) => asRecord(detail))
    .filter((detail): detail is Record<string, unknown> => Boolean(detail))
    .filter((detail) => detail.pass === false)
    .map((detail) => {
      if (typeof detail.groupId === "string") return detail.groupId;
      if (typeof detail.note === "string") return detail.note;
      return "missing-required-tool-group";
    });

  if (missingGroups.length > 0) {
    reasons.push(`tool:${missingGroups.join(",")}`);
  }

  if (evaluation.schemaPass === false) reasons.push("schema:false");

  const expectedEval = asRecord(evaluation.expectedEval);
  if (expectedEval?.pass === false) reasons.push("expected-result:false");

  return reasons.join("; ");
}

const TOOL_GROUP_EXPLANATIONS: Record<string, string> = {
  "progressive-discovery": "did not discover required tools first",
  "customer-source": "did not fetch customer data correctly",
  "transaction-window": "did not fetch the required transaction window",
  stats: "did not compute spend statistics correctly",
  "site-inspection": "did not inspect the target website as required",
  "channel-summary": "did not summarize the Slack channel correctly",
  "keyword-retrieval": "did not retrieve keyword matches from Drive correctly",
  "timezone-slot": "did not produce a valid cross-timezone meeting slot",
  "repo-change-pr": "did not produce the expected repo change and PR output",
  "code-execution": "did not execute the required code tool",
};

function explainToolGroups(issueSummary: string) {
  const marker = "tool:";
  const start = issueSummary.indexOf(marker);
  if (start < 0) return "";

  const tail = issueSummary.slice(start + marker.length);
  const end = tail.indexOf(";");
  const groupPart = (end >= 0 ? tail.slice(0, end) : tail).trim();
  if (!groupPart) return "";

  const groups = groupPart
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  if (groups.length === 0) return "";

  const parts = groups.map((group) => TOOL_GROUP_EXPLANATIONS[group] ?? `failed tool group: ${group}`);
  return parts.join("; ");
}

function humanizeFailureReason(issueSummary: string, outcome: EnrichedRun["outcome"]) {
  if (outcome === "passed") return "passed";

  if (/failed query:/i.test(issueSummary)) {
    return "Scenario database query failed before the run could be evaluated.";
  }

  if (
    /unable to connect|provider returned error|internal stream ended unexpectedly|socket connection closed unexpectedly|certificate verification error|invalid model id|timeout while waiting .*response|no tool output found for function call|http client error/i.test(
      issueSummary
    )
  ) {
    return "Provider/network issue prevented a usable model response.";
  }

  const reasons: string[] = [];
  const toolExplanation = explainToolGroups(issueSummary);
  if (toolExplanation) {
    reasons.push(`Tool step failed: ${toolExplanation}.`);
  }

  if (/schema:false/i.test(issueSummary)) {
    reasons.push("Output format did not match the required schema.");
  }

  if (/expected-result:false/i.test(issueSummary)) {
    reasons.push("Output content did not match the expected answer.");
  }

  if (reasons.length > 0) {
    return reasons.join(" ");
  }

  return "Run failed due to benchmark/model mismatch.";
}

function getIssueSummary(log: BenchmarkJsonLog, outcome: EnrichedRun["outcome"]) {
  if (outcome === "passed") return "passed";

  const directError =
    typeof log.error === "string" && log.error.trim().length > 0 ? log.error.trim() : "";
  if (directError) return directError;

  const eventErrors = (log.events ?? [])
    .filter((event) => event.level === "error")
    .flatMap((event) => [
      event.message,
      typeof event.data?.error === "string" ? event.data.error : undefined,
    ])
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0);

  if (eventErrors.length > 0) return eventErrors[0] ?? "failed";

  const evaluationReason = issueSummaryFromEvaluation(asRecord(log.evaluation));
  return evaluationReason || "failed";
}

async function loadRuns() {
  const runs: EnrichedRun[] = [];
  const glob = new Bun.Glob("results/**/*.json");

  for await (const path of glob.scan(".")) {
    const file = Bun.file(path);
    const data = (await file.json()) as Partial<BenchmarkJsonLog> & { winner?: unknown };

    if (data.winner !== undefined) continue;
    if (data.mode !== "regular" && data.mode !== "code-mode") continue;
    if (typeof data.model !== "string" || !(data.model in CANONICAL_PRICING)) continue;
    if (typeof data.scenarioNumber !== "number") continue;

    const log = data as BenchmarkJsonLog;
    const finishedAtMs = Date.parse(log.runFinishedAt ?? log.runStartedAt);
    const paradigm = getParadigm(log);
    const outcome = classifyOutcome(log);

    runs.push({
      path,
      log,
      paradigm,
      recomputedCostUsd: estimateCostUsd(log),
      recomputedCostNgn: 0,
      apiCalls: log.modelResponses?.length ?? 0,
      outcome,
      finishedAtMs,
      issueSummary: getIssueSummary(log, outcome),
    });
  }

  return runs;
}

function groupKey(run: EnrichedRun) {
  return `${run.log.model}::${run.log.scenarioNumber}::${run.paradigm}`;
}

function chooseRepresentativeRun(runs: EnrichedRun[]) {
  const outcomeRank = (run: EnrichedRun) => {
    if (run.outcome === "passed") return 3;
    if (run.outcome === "benchmark_or_model_failure") return 2;
    return 1;
  };

  return (
    [...runs].sort((a, b) => {
      const rankDelta = outcomeRank(b) - outcomeRank(a);
      if (rankDelta !== 0) return rankDelta;

      if (a.recomputedCostUsd !== b.recomputedCostUsd) {
        return a.recomputedCostUsd - b.recomputedCostUsd;
      }

      if (a.log.usage.totalTokens !== b.log.usage.totalTokens) {
        return a.log.usage.totalTokens - b.log.usage.totalTokens;
      }

      return b.finishedAtMs - a.finishedAtMs;
    })[0] ?? null
  );
}

function bestScenarioRuns(runs: EnrichedRun[]) {
  const grouped = new Map<string, EnrichedRun[]>();

  for (const run of runs) {
    const key = groupKey(run);
    const entries = grouped.get(key) ?? [];
    entries.push(run);
    grouped.set(key, entries);
  }

  return new Map(
    [...grouped.entries()].map(([key, entries]) => [key, chooseRepresentativeRun(entries)!])
  );
}

function getCoverageScenarios(runs: EnrichedRun[]) {
  return [...new Set(runs.map((run) => run.log.scenarioNumber))].sort((a, b) => a - b);
}

function average(values: number[]) {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function summarizeRunSet(
  allRuns: EnrichedRun[],
  bestRuns: Map<string, EnrichedRun>,
  paradigm: ParadigmKey,
  ngnPerUsd: number,
  model?: string
) {
  const subset = allRuns.filter(
    (run) => run.paradigm === paradigm && (!model || run.log.model === model)
  );
  const bestSubset = [...bestRuns.values()].filter(
    (run) => run.paradigm === paradigm && (!model || run.log.model === model)
  );

  const possibleScenarios = model ? TOTAL_SCENARIOS : INCLUDED_MODELS.length * TOTAL_SCENARIOS;
  const bestPasses = bestSubset.filter((run) => run.outcome === "passed").length;
  const coverage = bestSubset.length;

  const avgInputTokens = average(bestSubset.map((run) => run.log.usage.inputTokens));
  const avgOutputTokens = average(bestSubset.map((run) => run.log.usage.outputTokens));
  const avgTotalTokens = average(bestSubset.map((run) => run.log.usage.totalTokens));
  const avgCostUsd = average(bestSubset.map((run) => run.recomputedCostUsd));
  const avgApiCalls = average(bestSubset.map((run) => run.apiCalls));

  const nonModelFailures = bestSubset.filter((run) => run.outcome === "non_model_failure").length;
  const benchmarkFailures = bestSubset.filter(
    (run) => run.outcome === "benchmark_or_model_failure"
  ).length;

  const coverageScenarios = getCoverageScenarios(bestSubset);

  return {
    runs: subset.length,
    bestPasses,
    bestFailures: coverage - bestPasses,
    possibleScenarios,
    coverage,
    coverageScenarios,
    bestPassRate: coverage === 0 ? null : bestPasses / coverage,
    avgInputTokens,
    avgOutputTokens,
    avgTotalTokens,
    avgCostUsd,
    avgCostNgn: avgCostUsd === null ? null : toNgn(avgCostUsd, ngnPerUsd),
    avgApiCalls,
    nonModelFailures,
    benchmarkFailures,
  };
}

function summarizeRecovery(
  runs: EnrichedRun[],
  paradigm: ParadigmKey,
  ngnPerUsd: number,
  model?: string
) {
  const grouped = new Map<string, EnrichedRun[]>();

  for (const run of runs) {
    if (run.paradigm !== paradigm) continue;
    if (model && run.log.model !== model) continue;

    const key = `${run.log.model}::${run.log.scenarioNumber}`;
    const entries = grouped.get(key) ?? [];
    entries.push(run);
    grouped.set(key, entries);
  }

  const recoveryCostsUsd: number[] = [];

  for (const entries of grouped.values()) {
    entries.sort((a, b) => a.finishedAtMs - b.finishedAtMs);

    let failedCostUsd = 0;
    let sawFailure = false;

    for (const run of entries) {
      if (run.outcome === "passed") {
        if (sawFailure && failedCostUsd > 0) {
          recoveryCostsUsd.push(failedCostUsd);
        }
        failedCostUsd = 0;
        sawFailure = false;
        continue;
      }

      failedCostUsd += run.recomputedCostUsd;
      sawFailure = true;
    }
  }

  const averageUsd = average(recoveryCostsUsd);
  return {
    recoveredCases: recoveryCostsUsd.length,
    averageUsd,
    averageNgn: averageUsd === null ? null : toNgn(averageUsd, ngnPerUsd),
  };
}

function winnerLabel(
  progressive: ReturnType<typeof summarizeRunSet>,
  direct: ReturnType<typeof summarizeRunSet>,
  codeMode: ReturnType<typeof summarizeRunSet>
) {
  const score = (summary: ReturnType<typeof summarizeRunSet>) =>
    summary.bestPasses * 10_000 -
    (summary.avgTotalTokens ?? Number.POSITIVE_INFINITY) -
    ((summary.avgCostUsd ?? Number.POSITIVE_INFINITY) * 1_000);

  const candidates = [
    { label: "**Regular + Discovery**", score: score(progressive) },
    { label: "**Regular - Discovery**", score: score(direct) },
    { label: "**Code Mode**", score: score(codeMode) },
  ].sort((a, b) => b.score - a.score);

  if (!Number.isFinite(candidates[0]?.score ?? Number.NaN)) return "n/a";
  if ((candidates[0]?.score ?? 0) === (candidates[1]?.score ?? -1)) return "**Tie**";
  return candidates[0]!.label;
}

function modelSummaryRow(
  allRuns: EnrichedRun[],
  bestRuns: Map<string, EnrichedRun>,
  model: string,
  ngnPerUsd: number
) {
  const summarizeCell = (paradigm: ParadigmKey) => {
    const summary = summarizeRunSet(allRuns, bestRuns, paradigm, ngnPerUsd, model);
    const recovery = summarizeRecovery(allRuns, paradigm, ngnPerUsd, model);
    return `Best ${summary.bestPasses}/${TOTAL_SCENARIOS}, Coverage ${summary.coverage}/${TOTAL_SCENARIOS} [${formatScenarioSet(
      summary.coverageScenarios
    )}], Avg Cost ${formatNgn(summary.avgCostNgn)}, Avg Tokens ${summary.avgTotalTokens === null ? "n/a" : formatInt(
      Math.round(summary.avgTotalTokens)
    )}, Avg API ${formatRate(summary.avgApiCalls)}, Runs ${summary.runs}, Non-model ${summary.nonModelFailures}, Benchmark/model ${summary.benchmarkFailures}, Recovery ${formatNgn(
      recovery.averageNgn
    )}`;
  };

  const progressive = summarizeRunSet(
    allRuns,
    bestRuns,
    "regular-progressive",
    ngnPerUsd,
    model
  );
  const direct = summarizeRunSet(
    allRuns,
    bestRuns,
    "regular-full-tool-context",
    ngnPerUsd,
    model
  );
  const codeMode = summarizeRunSet(allRuns, bestRuns, "code-mode", ngnPerUsd, model);

  return `| \`${model}\` | ${summarizeCell("regular-progressive")} | ${summarizeCell(
    "regular-full-tool-context"
  )} | ${summarizeCell("code-mode")} | ${winnerLabel(progressive, direct, codeMode)} |`;
}

function escapePipe(value: string) {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

async function writePerModelReports(
  allRuns: EnrichedRun[],
  bestRuns: Map<string, EnrichedRun>,
  officialFxRate: OfficialFxRate
) {
  for (const model of INCLUDED_MODELS) {
    const modelRuns = allRuns
      .filter((run) => run.log.model === model)
      .sort((a, b) => b.finishedAtMs - a.finishedAtMs);

    const summaryTable = PARADIGM_ORDER.map((paradigm) => {
      const summary = summarizeRunSet(
        allRuns,
        bestRuns,
        paradigm,
        officialFxRate.ngnPerUsd,
        model
      );
      const recovery = summarizeRecovery(
        allRuns,
        paradigm,
        officialFxRate.ngnPerUsd,
        model
      );
      const attemptsPerCoveredScenario =
        summary.coverage === 0 ? null : summary.runs / summary.coverage;

      return `| ${PARADIGM_LABEL[paradigm]} | ${summary.bestPasses}/${TOTAL_SCENARIOS} | ${summary.coverage}/${TOTAL_SCENARIOS} | ${formatPercent(
        summary.bestPassRate
      )} | ${summary.runs} | ${summary.avgInputTokens === null ? "n/a" : formatInt(
        Math.round(summary.avgInputTokens)
      )} | ${summary.avgOutputTokens === null ? "n/a" : formatInt(
        Math.round(summary.avgOutputTokens)
      )} | ${summary.avgTotalTokens === null ? "n/a" : formatInt(
        Math.round(summary.avgTotalTokens)
      )} | ${formatNgn(summary.avgCostNgn)} | ${formatRate(summary.avgApiCalls)} | ${formatRate(
        attemptsPerCoveredScenario
      )} | ${summary.nonModelFailures} | ${summary.benchmarkFailures} | ${formatNgn(
        recovery.averageNgn
      )} |`;
    }).join("\n");

    const failureByParadigmRows = PARADIGM_ORDER.map((paradigm) => {
      const subset = modelRuns.filter((run) => run.paradigm === paradigm);
      const failed = subset.filter((run) => run.outcome !== "passed");
      const nonModel = failed.filter((run) => run.outcome === "non_model_failure").length;
      const benchmarkOrModel = failed.filter(
        (run) => run.outcome === "benchmark_or_model_failure"
      ).length;
      const failRate = subset.length === 0 ? null : failed.length / subset.length;

      return `| ${PARADIGM_LABEL[paradigm]} | ${subset.length} | ${failed.length} | ${formatPercent(
        failRate
      )} | ${nonModel} | ${benchmarkOrModel} |`;
    }).join("\n");

    const failedRuns = modelRuns.filter((run) => run.outcome !== "passed");
    const failureReasonMap = new Map<
      string,
      {
        count: number;
        scenarios: Set<number>;
        paradigms: Set<string>;
        latestPath: string;
        latestMs: number;
        humanReason: string;
      }
    >();

    for (const run of failedRuns) {
      const reason = run.issueSummary || "failed";
      const humanReason = humanizeFailureReason(reason, run.outcome);
      const existing = failureReasonMap.get(reason) ?? {
        count: 0,
        scenarios: new Set<number>(),
        paradigms: new Set<string>(),
        latestPath: run.path,
        latestMs: run.finishedAtMs,
        humanReason,
      };

      existing.count += 1;
      existing.scenarios.add(run.log.scenarioNumber);
      existing.paradigms.add(PARADIGM_LABEL[run.paradigm]);
      if (run.finishedAtMs > existing.latestMs) {
        existing.latestMs = run.finishedAtMs;
        existing.latestPath = run.path;
      }

      failureReasonMap.set(reason, existing);
    }

    const failureReasonRows =
      failureReasonMap.size === 0
        ? "| none | 0 | n/a | n/a | n/a |"
        : [...failureReasonMap.entries()]
            .sort((a, b) => {
              if (b[1].count !== a[1].count) return b[1].count - a[1].count;
              return b[1].latestMs - a[1].latestMs;
            })
            .map(([reason, detail]) =>
              `| ${escapePipe(reason)} | ${detail.count} | ${formatScenarioSet(
                [...detail.scenarios]
              )} | ${escapePipe([...detail.paradigms].join(", "))} | ${escapePipe(
                detail.humanReason
              )} | ${detail.latestPath} |`
            )
            .join("\n");

    const bestScenarioRows = Array.from({ length: TOTAL_SCENARIOS }, (_, index) => index + 1)
      .flatMap((scenarioNumber) =>
        PARADIGM_ORDER.map((paradigm) => {
          const key = `${model}::${scenarioNumber}::${paradigm}`;
          const run = bestRuns.get(key);
          return `| ${scenarioNumber} | ${PARADIGM_LABEL[paradigm]} | ${
            run ? (run.outcome === "passed" ? "PASS" : "FAIL") : "missing"
          } | ${run ? escapePipe(run.issueSummary) : "n/a"} | ${
            run ? escapePipe(humanizeFailureReason(run.issueSummary, run.outcome)) : "n/a"
          } | ${
            run ? formatNgn(run.recomputedCostNgn) : "n/a"
          } | ${run ? formatInt(run.log.usage.totalTokens) : "n/a"} | ${
            run ? run.path : "n/a"
          } |`;
        })
      )
      .join("\n");

    const runHistoryRows = modelRuns
      .map(
        (run) =>
          `| ${run.log.runFinishedAt ?? run.log.runStartedAt} | ${run.log.scenarioNumber} | ${
            PARADIGM_LABEL[run.paradigm]
          } | ${run.outcome === "passed" ? "PASS" : "FAIL"} | ${formatNgn(
            run.recomputedCostNgn
          )} | ${formatInt(run.log.usage.totalTokens)} | ${run.apiCalls} | ${escapePipe(
            run.issueSummary
          )} | ${escapePipe(humanizeFailureReason(run.issueSummary, run.outcome))} | ${run.path} |`
      )
      .join("\n");

    const markdown = `# ${model}

Official FX conversion in this report uses the official CBN NFEM weighted average rate as at ${officialFxRate.dateLabel}.

## Summary

| Paradigm | Best Passes | Covered Scenarios (max 6) | Best Pass Rate | Recorded Runs | Avg Input Tokens / Run | Avg Output Tokens / Run | Avg Total Tokens / Run | Avg Cost / Run (NGN) | Avg API Calls / Run | Attempts / Covered Scenario | Non-model Fail Runs | Benchmark/Model Fail Runs | Avg Recovery Cost (NGN) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
${summaryTable}

## Failure Analysis (All Recorded Rounds)

Total rounds: **${modelRuns.length}**
Failed rounds: **${failedRuns.length}**

| Paradigm | Recorded Rounds | Failed Rounds | Failure Rate | Non-model Failures | Benchmark/Model Failures |
|---|---:|---:|---:|---:|---:|
${failureByParadigmRows}

| Failure Reason | Count | Scenarios | Paradigms | Human-readable reason | Latest Example File |
|---|---:|---|---|---|---|
${failureReasonRows}

## Best Historical Scenario Outcomes

| Scenario | Paradigm | Best Outcome | Failure Detail | Failure Reason (Simple) | Representative Cost (NGN) | Representative Tokens | Representative File |
|---|---|---|---|---|---:|---:|---|
${bestScenarioRows}

## Run History

| Finished At | Scenario | Paradigm | Outcome | Cost (NGN) | Total Tokens | API Calls | Failure Detail | Failure Reason (Simple) | File |
|---|---:|---|---|---:|---:|---:|---|---|---|
${runHistoryRows}
`;

    const modelDir = `results/${sanitizeLabel(model)}`;
    await Bun.write(`${modelDir}/RESULTS.md`, `${markdown}\n`);
  }
}

async function main() {
  const officialFxRate = await fetchOfficialFxRate();
  const allRuns = await loadRuns();

  for (const run of allRuns) {
    run.recomputedCostNgn = toNgn(run.recomputedCostUsd, officialFxRate.ngnPerUsd);
  }

  const bestRuns = bestScenarioRuns(allRuns);

  const paradigmRows = PARADIGM_ORDER.map((paradigm) => {
    const summary = summarizeRunSet(
      allRuns,
      bestRuns,
      paradigm,
      officialFxRate.ngnPerUsd
    );
    const recovery = summarizeRecovery(allRuns, paradigm, officialFxRate.ngnPerUsd);
    const attemptsPerCoveredCell =
      summary.coverage === 0 ? null : summary.runs / summary.coverage;

    return `| ${PARADIGM_LABEL[paradigm]} | ${summary.runs} | ${summary.coverage}/${summary.possibleScenarios} [${formatScenarioSet(
      summary.coverageScenarios
    )}] | ${summary.bestPasses} | ${formatPercent(summary.bestPassRate)} | ${
      summary.avgInputTokens === null ? "n/a" : formatInt(Math.round(summary.avgInputTokens))
    } | ${
      summary.avgOutputTokens === null ? "n/a" : formatInt(Math.round(summary.avgOutputTokens))
    } | ${
      summary.avgTotalTokens === null ? "n/a" : formatInt(Math.round(summary.avgTotalTokens))
    } | ${formatNgn(summary.avgCostNgn)} | ${formatRate(summary.avgApiCalls)} | ${formatRate(
      attemptsPerCoveredCell
    )} | ${summary.nonModelFailures
    } | ${summary.benchmarkFailures} | ${formatNgn(recovery.averageNgn)} |`;
  }).join("\n");

  const pricingTable = INCLUDED_MODELS.map((model) => {
    const pricing = CANONICAL_PRICING[model]!;
    return `| \`${model}\` | ${formatNgn(
      toNgn(pricing.inputPerMillionUsd, officialFxRate.ngnPerUsd)
    )} | ${formatNgn(toNgn(pricing.outputPerMillionUsd, officialFxRate.ngnPerUsd))} |`;
  }).join("\n");

  const modelRows = INCLUDED_MODELS.map((model) =>
    modelSummaryRow(allRuns, bestRuns, model, officialFxRate.ngnPerUsd)
  ).join("\n");

  const markdown = `# Benchmark Results: Regular vs Code Mode

All metrics below use the **best-case representative run per (model, scenario, paradigm)** from \`results/\`.
When multiple runs exist, representative selection prefers: **pass > benchmark/model failure > non-model failure**, then lower cost, then lower tokens.
Official FX conversion uses the official CBN NFEM weighted average rate as at ${officialFxRate.dateLabel}.

Coverage denominator is always **48 model-scenario cells** (8 models x 6 scenarios) per paradigm.
Recorded Runs can be higher than Coverage because retries and repeated rounds are counted.

| Paradigm | Recorded Runs | Covered Model-Scenario Cells (max 48) | Best Passes | Best Pass Rate | Avg Input Tokens / Best-Case Run | Avg Output Tokens / Best-Case Run | Avg Total Tokens / Best-Case Run | Avg Cost / Best-Case Run (NGN) | Avg API Calls / Best-Case Run | Attempts / Covered Cell | Non-model Fail Best Cases | Benchmark/Model Fail Best Cases | Avg Recovery Cost (NGN) |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
${paradigmRows}

## Canonical Pricing Used

| Model | Input / 1M Tokens (NGN) | Output / 1M Tokens (NGN) |
|---|---:|---:|
${pricingTable}

## Per-Model Comparison

| Model | Regular (with progressive discovery) | Regular (without progressive discovery) | Code Mode | Winner |
|---|---|---|---|---|
${modelRows}

## Glossary

| Term | Meaning |
|---|---|
| Recorded Runs | Total attempts found in \`results/\` for that paradigm. |
| Covered Model-Scenario Cells | Unique (model, scenario) pairs with at least one run in that paradigm. Max is 48 because there are 8 models and 6 scenarios. |
| Attempts / Covered Cell | Recorded Runs divided by Covered Cells. This explains rows like 92 runs with 48/48 coverage (many retries per covered cell). |
| Best Passes | Number of covered scenarios where the representative run passed. |
| Non-model Fail Best Cases | Representative runs that failed due to provider, network, timeout, or other infra/runtime issues. |
| Benchmark/Model Fail Best Cases | Representative runs that failed due to evaluation mismatch, missing required tool evidence, or incorrect output content. |
| Avg Recovery Cost | Average spend on failed attempts before a later pass for the same model + scenario + paradigm. |
`;

  await Bun.write("RESULTS.md", `${markdown}\n`);
  await writePerModelReports(allRuns, bestRuns, officialFxRate);
  console.log("Updated RESULTS.md and per-model reports");
}

await main();
