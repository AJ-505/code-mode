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

function summarizeParsedResult(parsed: Record<string, unknown>) {
  const preview: Record<string, unknown> = {};
  const entries = Object.entries(parsed);
  const previewEntries = entries.slice(0, 8);

  for (const [key, value] of previewEntries) {
    if (Array.isArray(value)) {
      preview[key] = `${value.length} item(s)`;
      continue;
    }

    if (typeof value === "object" && value !== null) {
      preview[key] = `${Object.keys(value as Record<string, unknown>).length} field(s)`;
      continue;
    }

    preview[key] = value;
  }

  if (entries.length > previewEntries.length) {
    preview.omittedFieldCount = entries.length - previewEntries.length;
  }

  return preview;
}

export type BenchmarkMode = "regular" | "code-mode";
export type RegularToolStrategy =
  | "progressive-discovery"
  | "full-tool-context";
export type CodeModeToolStrategy =
  | "full-api-context"
  | "progressive-discovery";

export type PricingConfig = {
  inputPerMillionUsd: number;
  outputPerMillionUsd: number;
  cachedInputPerMillionUsd: number;
};

export type BenchmarkJsonLog = {
  benchmarkId: string;
  scenarioNumber: number;
  mode: BenchmarkMode;
  regularToolStrategy?: RegularToolStrategy;
  codeModeToolStrategy?: CodeModeToolStrategy;
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
  regularToolStrategy?: RegularToolStrategy;
  codeModeToolStrategy?: CodeModeToolStrategy;
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
  const pairLabel = sanitizeLabel(log.pairId);
  const baseFileName = `scenario-${log.scenarioNumber}-${log.mode}-${pairLabel}`;
  return `results/${modelLabel}/${baseFileName}.json`;
}

async function getUniqueResultsPath(log: BenchmarkJsonLog): Promise<string> {
  const modelLabel = sanitizeLabel(log.model);
  const pairLabel = sanitizeLabel(log.pairId);
  const baseFileName = `scenario-${log.scenarioNumber}-${log.mode}-${pairLabel}`;
  const modelDir = `results/${modelLabel}`;

  await mkdir(modelDir, { recursive: true });

  let filePath = `${modelDir}/${baseFileName}.json`;
  let counter = 1;

  while (await Bun.file(filePath).exists()) {
    filePath = `${modelDir}/${baseFileName}-${counter}.json`;
    counter++;
  }

  return filePath;
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
  const cost =
    (snapshot.inputTokens / 1_000_000) * pricing.inputPerMillionUsd +
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
      ...(config.regularToolStrategy
        ? { regularToolStrategy: config.regularToolStrategy }
        : {}),
      ...(config.codeModeToolStrategy
        ? { codeModeToolStrategy: config.codeModeToolStrategy }
        : {}),
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

  printBenchmarkHeader() {
    const divider = chalk.cyan("═".repeat(60));
    console.log("\n" + divider);
    console.log(chalk.bold.cyan(`  BENCHMARK RUN: Scenario ${this.log.scenarioNumber}`));
    console.log(divider);
    console.log(`  ${chalk.yellow("Model:")}     ${chalk.white(this.log.model)}`);
    console.log(`  ${chalk.yellow("Mode:")}      ${chalk.white(this.log.mode)}`);
    if (this.log.mode === "regular" && this.log.regularToolStrategy) {
      console.log(
        `  ${chalk.yellow("Strategy:")}  ${chalk.white(this.log.regularToolStrategy)}`
      );
    } else if (this.log.mode === "code-mode" && this.log.codeModeToolStrategy) {
      console.log(
        `  ${chalk.yellow("Strategy:")}  ${chalk.white(this.log.codeModeToolStrategy)}`
      );
    }
    console.log(`  ${chalk.yellow("Pair ID:")}   ${chalk.dim(this.log.pairId)}`);
    console.log(`  ${chalk.yellow("Run ID:")}    ${chalk.dim(this.log.runId)}`);
    console.log(`  ${chalk.yellow("Started:")}   ${chalk.dim(this.log.runStartedAt)}`);
    console.log(divider + "\n");
  }

  printBenchmarkSummary() {
    const divider = chalk.cyan("─".repeat(60));
    const statusColor = this.log.status === "passed" ? chalk.green : chalk.red;
    const statusIcon = this.log.status === "passed" ? "✓" : "✗";

    console.log("\n" + divider);
    console.log(chalk.bold.cyan("  BENCHMARK SUMMARY"));
    console.log(divider);
    console.log(`  ${chalk.yellow("Status:")}        ${statusColor(`${statusIcon} ${this.log.status.toUpperCase()}`)}`);
    console.log(`  ${chalk.yellow("Input Tokens:")}  ${chalk.white(this.log.usage.inputTokens.toLocaleString())}`);
    console.log(`  ${chalk.yellow("Output Tokens:")} ${chalk.white(this.log.usage.outputTokens.toLocaleString())}`);
    console.log(`  ${chalk.yellow("Total Tokens:")}  ${chalk.white(this.log.usage.totalTokens.toLocaleString())}`);
    console.log(`  ${chalk.yellow("Cost (USD):")}    ${chalk.green("$" + this.log.usage.estimatedCostUsd.toFixed(6))}`);
    console.log(`  ${chalk.yellow("Cost (NGN):")}    ${chalk.green("₦" + (this.log.usage.estimatedCostUsd * 1550).toFixed(2))}`);
    console.log(`  ${chalk.yellow("Tool Calls:")}    ${chalk.white(this.log.toolCalls.length)}`);
    console.log(`  ${chalk.yellow("Duration:")}      ${chalk.white(this.getDuration())}`);
    console.log(divider + "\n");
  }

  private getDuration(): string {
    if (!this.log.runFinishedAt) return "In progress...";
    const start = new Date(this.log.runStartedAt).getTime();
    const end = new Date(this.log.runFinishedAt).getTime();
    const ms = end - start;
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(2)}min`;
  }

  printProgress(step: string, current: number, total: number) {
    const pct = Math.round((current / total) * 100);
    const filled = Math.round(pct / 5);
    const bar = chalk.green("█".repeat(filled)) + chalk.gray("░".repeat(20 - filled));
    console.log(`  ${chalk.cyan("→")} ${step} [${bar}] ${pct}%`);
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
    const parsedFromExpected =
      expectedEval &&
      typeof expectedEval.parsed === "object" &&
      expectedEval.parsed !== null
        ? (expectedEval.parsed as Record<string, unknown>)
        : null;
    const parsedFromSchema =
      typeof evaluation.parsed === "object" && evaluation.parsed !== null
        ? (evaluation.parsed as Record<string, unknown>)
        : null;
    const parsed = parsedFromExpected ?? parsedFromSchema;

    this.info(
      "model_result",
      "Model result (parsed)",
      parsed ? summarizeParsedResult(parsed) : { parsed: "(missing)" }
    );

    const toolEval =
      typeof evaluation.toolEval === "object" && evaluation.toolEval !== null
        ? (evaluation.toolEval as Record<string, unknown>)
        : null;
    const expectedPass =
      expectedEval && typeof expectedEval.pass === "boolean"
        ? (expectedEval.pass as boolean)
        : null;
    const schemaPass =
      typeof evaluation.schemaPass === "boolean"
        ? (evaluation.schemaPass as boolean)
        : null;

    const summary: Record<string, unknown> = {
      overallPass: evaluation.overallPass === true,
      toolPass: toolEval?.pass === true,
    };

    if (expectedPass !== null) {
      summary.outputValidation = "expected-result";
      summary.outputPass = expectedPass;
      summary.expectedPass = expectedPass;
    } else if (schemaPass !== null) {
      summary.outputValidation = "schema-parse";
      summary.outputPass = schemaPass;
      summary.schemaPass = schemaPass;
    }

    this.info("evaluation_human", "Evaluation summary", summary);
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
    const path = await getUniqueResultsPath(this.log);
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
  const modelDir = `results/${modelLabel}`;
  await mkdir(modelDir, { recursive: true });

  const baseFileName = `scenario-${options.scenarioNumber}-final-${pairLabel}`;
  let filePath = `${modelDir}/${baseFileName}.json`;
  let counter = 1;
  while (await Bun.file(filePath).exists()) {
    filePath = `${modelDir}/${baseFileName}-${counter}.json`;
    counter++;
  }
  const path = filePath;
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
