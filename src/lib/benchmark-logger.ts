import * as Bun from "bun";
import chalk from "chalk";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { env } from "../env.js";

type UsageLike = {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  inputTokensDetails?: {
    cachedTokens?: number;
  };
};

function prettyLabel(key: string) {
  return key
    .replaceAll(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .toLowerCase();
}

function indentBlock(value: string, spaces = 2) {
  const prefix = " ".repeat(spaces);
  return value
    .split("\n")
    .map((line) => `${prefix}${line}`)
    .join("\n");
}

function formatHumanValue(value: unknown) {
  if (typeof value === "string") {
    if (value.includes("\n")) return `\n${indentBlock(value, 4)}`;
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (value === null || value === undefined) {
    return "(none)";
  }

  if (Array.isArray(value)) {
    return value.map((item) => compactHumanValue(item)).join(", ");
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, entry]) => `${prettyLabel(key)}=${compactHumanValue(entry)}`)
      .join("; ");
  }

  return String(value);
}

function compactHumanValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null || value === undefined) return "(none)";

  if (Array.isArray(value)) {
    return value.map((item) => compactHumanValue(item)).join(", ");
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, entry]) => `${prettyLabel(key)}=${compactHumanValue(entry)}`)
      .join("; ");
  }

  return String(value);
}

function cleanToolName(value: string) {
  return value.replace(/<\|[^|]+\|>\w*/g, "").trim();
}

function previewModelText(text: string) {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= 240) return compact;
  return `${compact.slice(0, 240)}...`;
}

export type BenchmarkMode = "regular" | "code-mode";

export type PricingConfig = {
  inputPerMillionUsd: number;
  outputPerMillionUsd: number;
  cachedInputPerMillionUsd: number;
};

export type BenchmarkJsonLog = {
  benchmarkId: string;
  scenarioNumber: number;
  mode: BenchmarkMode;
  model: string;
  pairId: string;
  runId: string;
  runStartedAt: string;
  runFinishedAt?: string;
  status: "passed" | "failed";
  didFailTest: boolean;
  pricing: PricingConfig;
  usage: {
    inputTokens: number;
    outputTokens: number;
    cachedTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
  };
  modelResponses: Array<{
    stage: string;
    text: string;
    reasoning?: string;
    usage: {
      inputTokens: number;
      outputTokens: number;
      cachedTokens: number;
      totalTokens: number;
      estimatedCostUsd: number;
    };
  }>;
  toolCalls: Array<{
    stage: string;
    name: string;
    arguments: unknown;
  }>;
  events: Array<{
    ts: string;
    level: "info" | "error";
    event: string;
    message: string;
    data?: Record<string, unknown>;
  }>;
  evaluation?: Record<string, unknown>;
  expectedResult?: Record<string, unknown>;
  comparison?: {
    winner: "regular" | "code-mode" | "tie";
    reasons: string[];
  };
  error?: string;
};

type LoggerConfig = {
  benchmarkId: string;
  scenarioNumber: number;
  mode: BenchmarkMode;
  model: string;
  pairId: string;
  runId: string;
  pricing: PricingConfig;
};

const DEFAULT_PRICING: PricingConfig = {
  inputPerMillionUsd: env.INPUT_COST_PER_MILLION_USD,
  outputPerMillionUsd: env.OUTPUT_COST_PER_MILLION_USD,
  cachedInputPerMillionUsd: env.CACHED_INPUT_COST_PER_MILLION_USD,
};

function sanitizeLabel(value: string) {
  return value.replaceAll(/[^a-zA-Z0-9_.-]/g, "_");
}

export function toResultLabel(value: string) {
  return sanitizeLabel(value);
}

function getResultsPath(log: BenchmarkJsonLog) {
  const modelLabel = sanitizeLabel(log.model);
  const dateLabel = sanitizeLabel(log.runStartedAt.replaceAll(":", "-"));
  const pairLabel = sanitizeLabel(log.pairId);
  const fileName = `${modelLabel}-scenario-${log.scenarioNumber}-${log.mode}-pair-${pairLabel}-${log.runId}-${dateLabel}.json`;
  return `results/${fileName}`;
}

function getUsageSnapshot(usage: UsageLike | null | undefined) {
  return {
    inputTokens: usage?.inputTokens ?? 0,
    outputTokens: usage?.outputTokens ?? 0,
    cachedTokens: usage?.inputTokensDetails?.cachedTokens ?? 0,
    totalTokens: usage?.totalTokens ?? 0,
  };
}

function estimateCost(snapshot: {
  inputTokens: number;
  outputTokens: number;
  cachedTokens: number;
}, pricing: PricingConfig) {
  const nonCachedInput = Math.max(snapshot.inputTokens - snapshot.cachedTokens, 0);

  const cost =
    (nonCachedInput / 1_000_000) * pricing.inputPerMillionUsd +
    (snapshot.cachedTokens / 1_000_000) * pricing.cachedInputPerMillionUsd +
    (snapshot.outputTokens / 1_000_000) * pricing.outputPerMillionUsd;

  return Number(cost.toFixed(6));
}

export class BenchmarkLogger {
  private readonly log: BenchmarkJsonLog;

  constructor(config: LoggerConfig) {
    this.log = {
      benchmarkId: config.benchmarkId,
      scenarioNumber: config.scenarioNumber,
      mode: config.mode,
      model: config.model,
      pairId: config.pairId,
      runId: config.runId,
      runStartedAt: new Date().toISOString(),
      status: "failed",
      didFailTest: true,
      pricing: config.pricing,
      usage: {
        inputTokens: 0,
        outputTokens: 0,
        cachedTokens: 0,
        totalTokens: 0,
        estimatedCostUsd: 0,
      },
      modelResponses: [],
      toolCalls: [],
      events: [],
    };
  }

  static getDefaultPricing() {
    return DEFAULT_PRICING;
  }

  info(event: string, message: string, data?: Record<string, unknown>) {
    const ts = new Date().toISOString();
    console.log(
      `${chalk.dim(`[${ts}]`)} ${chalk.cyan(`[${this.log.mode}]`)} ${chalk.white(message)}`
    );
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        console.log(
          `  ${chalk.gray("-")} ${chalk.yellow(prettyLabel(key))}: ${formatHumanValue(value)}`
        );
      }
    }
    this.log.events.push(
      data
        ? { ts, level: "info", event, message, data }
        : { ts, level: "info", event, message }
    );
  }

  error(event: string, message: string, data?: Record<string, unknown>) {
    const ts = new Date().toISOString();
    console.error(
      `${chalk.dim(`[${ts}]`)} ${chalk.red(`[${this.log.mode}]`)} ${chalk.red(message)}`
    );
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        console.error(
          `  ${chalk.gray("-")} ${chalk.yellow(prettyLabel(key))}: ${formatHumanValue(value)}`
        );
      }
    }
    this.log.events.push(
      data
        ? { ts, level: "error", event, message, data }
        : { ts, level: "error", event, message }
    );
  }

  logPrompts(stage: string, prompts: { systemPrompt: string; userPrompt: string }) {
    this.info("prompts", `Prompts for ${stage}`, {
      systemPrompt: prompts.systemPrompt,
      userPrompt: prompts.userPrompt,
    });
  }

  logExpectedResult(expected: Record<string, unknown>) {
    this.info("expected_result_human", "Expected result (from seeded DB)", expected);
  }

  addModelResponse(
    stage: string,
    text: string,
    usage: UsageLike | null | undefined,
    reasoning?: string
  ) {
    const snapshot = getUsageSnapshot(usage);
    const estimatedCostUsd = estimateCost(snapshot, this.log.pricing);

    this.info("model_response", `Model response captured for ${stage}`, {
      responsePreview: previewModelText(text),
      responseChars: text.length,
      inputTokens: snapshot.inputTokens,
      outputTokens: snapshot.outputTokens,
      cachedTokens: snapshot.cachedTokens,
      totalTokens: snapshot.totalTokens,
      estimatedCostUsd,
    });

    this.log.modelResponses.push({
      stage,
      text,
      ...(reasoning ? { reasoning } : {}),
      usage: {
        ...snapshot,
        estimatedCostUsd,
      },
    });

    this.log.usage.inputTokens += snapshot.inputTokens;
    this.log.usage.outputTokens += snapshot.outputTokens;
    this.log.usage.cachedTokens += snapshot.cachedTokens;
    this.log.usage.totalTokens += snapshot.totalTokens;
    this.log.usage.estimatedCostUsd = estimateCost(
      {
        inputTokens: this.log.usage.inputTokens,
        outputTokens: this.log.usage.outputTokens,
        cachedTokens: this.log.usage.cachedTokens,
      },
      this.log.pricing
    );
  }

  addToolCalls(stage: string, calls: Array<{ name: string; arguments: unknown }>) {
    for (const call of calls) {
      const normalizedName = cleanToolName(call.name);
      this.info("tool_call", `Tool called in ${stage}: ${normalizedName}`, {
        stage,
        toolName: normalizedName,
        callDetails:
          normalizedName === "execute_scenario1_code"
            ? "TypeScript code provided (see code block below)"
            : compactHumanValue(call.arguments),
      });

      if (
        typeof call.arguments === "object" &&
        call.arguments !== null &&
        "typescript" in call.arguments &&
        typeof (call.arguments as { typescript?: unknown }).typescript === "string"
      ) {
        this.info("tool_code", "Code passed to execute_scenario1_code", {
          code: (call.arguments as { typescript: string }).typescript,
        });
      }

      this.log.toolCalls.push({
        stage,
        name: normalizedName,
        arguments: call.arguments,
      });
    }
  }

  setEvaluation(evaluation: Record<string, unknown>) {
    this.log.evaluation = evaluation;

    const expectedEval =
      typeof evaluation.expectedEval === "object" &&
      evaluation.expectedEval !== null
        ? (evaluation.expectedEval as Record<string, unknown>)
        : null;
    const parsed =
      expectedEval &&
      typeof expectedEval.parsed === "object" &&
      expectedEval.parsed !== null
        ? (expectedEval.parsed as Record<string, unknown>)
        : null;

    this.info("model_result", "Model result (parsed)", {
      topCustomerId: parsed?.topCustomerId ?? "(missing)",
      topCustomerName: parsed?.topCustomerName ?? "(missing)",
      transactionCount: parsed?.transactionCount ?? "(missing)",
      averageSpend: parsed?.averageSpend ?? "(missing)",
      totalSpend: parsed?.totalSpend ?? "(missing)",
      fromIso: parsed?.fromIso ?? "(missing)",
      toIso: parsed?.toIso ?? "(missing)",
    });

    const toolEval =
      typeof evaluation.toolEval === "object" && evaluation.toolEval !== null
        ? (evaluation.toolEval as Record<string, unknown>)
        : null;

    this.info("evaluation_human", "Evaluation summary", {
      overallPass: evaluation.overallPass === true,
      toolPass: toolEval?.pass === true,
      expectedPass: expectedEval?.pass === true,
    });
  }

  setExpectedResult(expectedResult: Record<string, unknown>) {
    this.log.expectedResult = expectedResult;
  }

  setComparison(comparison: { winner: "regular" | "code-mode" | "tie"; reasons: string[] }) {
    this.log.comparison = comparison;
  }

  finish(options: { didFailTest: boolean; error?: string }) {
    this.log.didFailTest = options.didFailTest;
    this.log.status = options.didFailTest ? "failed" : "passed";
    this.log.runFinishedAt = new Date().toISOString();
    if (options.error) this.log.error = options.error;

    this.info("run_finished", "Benchmark run finished", {
      status: this.log.status,
      didFailTest: this.log.didFailTest,
      inputTokens: this.log.usage.inputTokens,
      outputTokens: this.log.usage.outputTokens,
      cachedTokens: this.log.usage.cachedTokens,
      totalTokens: this.log.usage.totalTokens,
      estimatedCostUsd: this.log.usage.estimatedCostUsd,
    });
  }

  async writeToFile() {
    await mkdir("results", { recursive: true });
    const path = getResultsPath(this.log);
    await Bun.write(path, `${JSON.stringify(this.log, null, 2)}\n`);
    this.info("log_written", "Wrote JSON benchmark log file", { path });
    return path;
  }

  toJSON() {
    return this.log;
  }
}

export async function writeScenarioFinalComparison(options: {
  benchmarkId: string;
  scenarioNumber: number;
  model: string;
  pairId: string;
  runId: string;
  regular: BenchmarkJsonLog;
  codeMode: BenchmarkJsonLog;
}) {
  await mkdir("results", { recursive: true });

  const score = (log: BenchmarkJsonLog) => {
    const passScore = log.didFailTest ? 0 : 1;
    const tokenPenalty = log.usage.totalTokens;
    const costPenalty = log.usage.estimatedCostUsd;
    return passScore * 10_000 - tokenPenalty - costPenalty * 1_000;
  };

  const regularScore = score(options.regular);
  const codeModeScore = score(options.codeMode);

  let winner: "regular" | "code-mode" | "tie" = "tie";
  if (regularScore > codeModeScore) winner = "regular";
  if (codeModeScore > regularScore) winner = "code-mode";

  const reasons = [
    `regular: didFail=${options.regular.didFailTest}, tokens=${options.regular.usage.totalTokens}, costUsd=${options.regular.usage.estimatedCostUsd}`,
    `code-mode: didFail=${options.codeMode.didFailTest}, tokens=${options.codeMode.usage.totalTokens}, costUsd=${options.codeMode.usage.estimatedCostUsd}`,
  ];

  const comparison = {
    benchmarkId: options.benchmarkId,
    scenarioNumber: options.scenarioNumber,
    model: options.model,
    pairId: options.pairId,
    runId: options.runId,
    createdAt: new Date().toISOString(),
    winner,
    reasons,
    regular: {
      didFailTest: options.regular.didFailTest,
      totalTokens: options.regular.usage.totalTokens,
      estimatedCostUsd: options.regular.usage.estimatedCostUsd,
    },
    codeMode: {
      didFailTest: options.codeMode.didFailTest,
      totalTokens: options.codeMode.usage.totalTokens,
      estimatedCostUsd: options.codeMode.usage.estimatedCostUsd,
    },
  };

  const modelLabel = sanitizeLabel(options.model);
  const pairLabel = sanitizeLabel(options.pairId);
  const fileName = `${modelLabel}-scenario-${options.scenarioNumber}-final-pair-${pairLabel}-${options.runId}-${sanitizeLabel(comparison.createdAt.replaceAll(":", "-"))}.json`;
  const path = `results/${fileName}`;
  await Bun.write(path, `${JSON.stringify(comparison, null, 2)}\n`);

  return { path, comparison };
}

type PendingPairRecord = {
  scenarioNumber: number;
  model: string;
  pairId: string;
  regularLogPath?: string;
  codeModeLogPath?: string;
  updatedAt: string;
};

const pendingPairsPath = "results/.scenario-pairs.json";

async function loadPendingPairs(): Promise<PendingPairRecord[]> {
  try {
    const raw = await readFile(pendingPairsPath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is PendingPairRecord =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as { scenarioNumber?: unknown }).scenarioNumber === "number" &&
        typeof (item as { model?: unknown }).model === "string" &&
        typeof (item as { pairId?: unknown }).pairId === "string" &&
        typeof (item as { updatedAt?: unknown }).updatedAt === "string"
    );
  } catch {
    return [];
  }
}

async function savePendingPairs(records: PendingPairRecord[]) {
  await mkdir("results", { recursive: true });
  await writeFile(pendingPairsPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
}

export async function getOrCreateBenchmarkPairId(options: {
  scenarioNumber: number;
  model: string;
}) {
  const records = await loadPendingPairs();
  const matching = records
    .filter(
      (record) =>
        record.scenarioNumber === options.scenarioNumber &&
        record.model === options.model &&
        !(record.regularLogPath && record.codeModeLogPath)
    )
    .sort(
      (a, b) =>
        Date.parse(b.updatedAt || "1970-01-01T00:00:00.000Z") -
        Date.parse(a.updatedAt || "1970-01-01T00:00:00.000Z")
    );

  const openPair = matching[0];
  if (openPair) {
    return openPair.pairId;
  }

  const pairId = randomUUID().replaceAll("-", "").slice(0, 12);
  records.push({
    scenarioNumber: options.scenarioNumber,
    model: options.model,
    pairId,
    updatedAt: new Date().toISOString(),
  });
  await savePendingPairs(records);
  return pairId;
}

export async function markBenchmarkPairLog(options: {
  scenarioNumber: number;
  model: string;
  pairId: string;
  mode: BenchmarkMode;
  logPath: string;
}) {
  const records = await loadPendingPairs();
  const now = new Date().toISOString();

  let record = records.find(
    (entry) =>
      entry.scenarioNumber === options.scenarioNumber &&
      entry.model === options.model &&
      entry.pairId === options.pairId
  );

  if (!record) {
    record = {
      scenarioNumber: options.scenarioNumber,
      model: options.model,
      pairId: options.pairId,
      updatedAt: now,
    };
    records.push(record);
  }

  if (options.mode === "regular") {
    record.regularLogPath = options.logPath;
  } else {
    record.codeModeLogPath = options.logPath;
  }

  record.updatedAt = now;
  await savePendingPairs(records);
}

export async function findPairedBenchmarkLog(options: {
  scenarioNumber: number;
  model: string;
  pairId: string;
  mode: BenchmarkMode;
}) {
  const records = await loadPendingPairs();
  const record = records.find(
    (entry) =>
      entry.scenarioNumber === options.scenarioNumber &&
      entry.model === options.model &&
      entry.pairId === options.pairId
  );

  if (!record) return null;

  const path =
    options.mode === "regular" ? record.regularLogPath : record.codeModeLogPath;
  if (!path) return null;

  try {
    return (await Bun.file(path).json()) as BenchmarkJsonLog;
  } catch {
    return null;
  }
}

export async function findLatestBenchmarkLog(options: {
  scenarioNumber: number;
  model: string;
  mode: BenchmarkMode;
}) {
  const modelLabel = sanitizeLabel(options.model);
  const pattern = `results/${modelLabel}-scenario-${options.scenarioNumber}-${options.mode}-*.json`;

  let latest: BenchmarkJsonLog | null = null;
  let latestTs = 0;

  const glob = new Bun.Glob(pattern);
  for await (const path of glob.scan(".")) {
    const file = Bun.file(path);
    if (!(await file.exists())) continue;

    try {
      const parsed = (await file.json()) as BenchmarkJsonLog;
      const ts = Date.parse(parsed.runFinishedAt ?? parsed.runStartedAt);
      if (ts > latestTs) {
        latestTs = ts;
        latest = parsed;
      }
    } catch {
      continue;
    }
  }

  return latest;
}
