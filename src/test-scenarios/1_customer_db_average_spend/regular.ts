import { createInitialState } from "@openrouter/agent";
import {
  BenchmarkLogger,
  findLatestBenchmarkLog,
  writeScenarioFinalComparison,
} from "../../lib/benchmark-logger.js";
import { type Model, openrouter } from "../../lib/chat-generation.js";
import { extractResponseText } from "../../lib/openrouter-response.js";
import {
  discoverTools,
  getAllRegisteredProgressiveToolNames,
  getProgressiveToolsByName,
  registerProgressiveTools,
} from "../../lib/progressive-tool-discovery.js";
import { PROMPTS } from "../../lib/prompts.js";
import {
  closeScenario1DbPool,
  computeScenario1ExpectedResult,
} from "./data.js";
import { evaluateScenario1Run } from "./evaluation.js";
import {
  createRunId,
  defaultScenario1Model,
  extractDiscoveredToolNames,
  modelCallTimeoutMs,
  scenario1BenchmarkId,
  scenario1Number,
  withTimeout,
} from "./shared.js";
import { benchmark1Tools } from "./tools.js";

const model: Model = defaultScenario1Model;
const runId = createRunId();

registerProgressiveTools([...benchmark1Tools]);

let inMemoryConversationState = createInitialState();

const stateAccessor = {
  load: async () => inMemoryConversationState,
  save: async (nextState: typeof inMemoryConversationState) => {
    inMemoryConversationState = nextState;
  },
};

const logger = new BenchmarkLogger({
  benchmarkId: scenario1BenchmarkId,
  scenarioNumber: scenario1Number,
  mode: "regular",
  model,
  runId,
  pricing: BenchmarkLogger.getDefaultPricing(),
});

try {
  logger.info("run_start", "Scenario 1 regular benchmark started", {
    benchmarkId: scenario1BenchmarkId,
    model,
    modelCallTimeoutMs,
  });

  const expected = await computeScenario1ExpectedResult();
  logger.setExpectedResult(expected);
  logger.info("expected_result", "Computed scenario expected result from DB seed", {
    topCustomerId: expected.topCustomerId,
    transactionCount: expected.transactionCount,
    averageSpend: expected.averageSpend,
  });

  const discoveryResult = openrouter.callModel({
    model,
    input: [
      { role: "system", content: PROMPTS.systemPrompt },
      { role: "user", content: PROMPTS.scenario1 },
    ],
    tools: [discoverTools] as const,
    state: stateAccessor,
  });

  const discoveryResponse = await withTimeout(
    "regular discovery response",
    discoveryResult.getResponse(),
    modelCallTimeoutMs
  );
  const discoveryText = extractResponseText(discoveryResponse);
  logger.addModelResponse("discovery", discoveryText, discoveryResponse.usage);

  const discoveryCalls = await withTimeout(
    "regular discovery tool calls",
    discoveryResult.getToolCalls(),
    modelCallTimeoutMs
  );
  logger.addToolCalls(
    "discovery",
    discoveryCalls.map((call) => ({ name: call.name, arguments: call.arguments }))
  );

  const discovered = extractDiscoveredToolNames(discoveryCalls);
  const unlocked = getProgressiveToolsByName(discovered);

  const toolsForExecution =
    unlocked.length > 0
      ? [discoverTools, ...unlocked]
      : [
          discoverTools,
          ...getProgressiveToolsByName(getAllRegisteredProgressiveToolNames()),
        ];

  logger.info("execution_stage", "Starting regular execution stage", {
    discoveredTools: discovered,
    unlockedToolCount: unlocked.length,
    executionToolCount: toolsForExecution.length,
  });

  const executionResult = openrouter.callModel({
    model,
    input: [
      {
        role: "user",
        content:
          "Continue from the previous step. Use the unlocked tools only. Return STRICT JSON with keys: topCustomerId, topCustomerName, transactionCount, totalSpend, averageSpend, fromIso, toIso.",
      },
    ],
    tools: toolsForExecution,
    state: stateAccessor,
  });

  const executionResponse = await withTimeout(
    "regular execution response",
    executionResult.getResponse(),
    modelCallTimeoutMs
  );
  const finalText = extractResponseText(executionResponse);
  logger.addModelResponse("execution", finalText, executionResponse.usage);

  const executionCalls = await withTimeout(
    "regular execution tool calls",
    executionResult.getToolCalls(),
    modelCallTimeoutMs
  );
  logger.addToolCalls(
    "execution",
    executionCalls.map((call) => ({ name: call.name, arguments: call.arguments }))
  );

  const calledToolNames = [
    ...discoveryCalls.map((call) => call.name),
    ...executionCalls.map((call) => call.name),
  ];

  const evaluation = evaluateScenario1Run({
    mode: "regular",
    calledToolNames,
    finalText,
    expected,
  });

  logger.setEvaluation(evaluation as unknown as Record<string, unknown>);
  logger.finish({ didFailTest: !evaluation.overallPass });

  const latestCodeMode = await findLatestBenchmarkLog({
    scenarioNumber: scenario1Number,
    model,
    mode: "code-mode",
  });

  if (latestCodeMode) {
    const final = await writeScenarioFinalComparison({
      benchmarkId: scenario1BenchmarkId,
      scenarioNumber: scenario1Number,
      model,
      runId,
      regular: logger.toJSON(),
      codeMode: latestCodeMode,
    });
    logger.setComparison({
      winner: final.comparison.winner,
      reasons: final.comparison.reasons,
    });

    logger.info("comparison_written", "Wrote final regular vs code-mode comparison", {
      path: final.path,
      winner: final.comparison.winner,
    });
  } else {
    logger.info(
      "comparison_skipped",
      "No code-mode log found yet; final comparison file not written"
    );
  }

  const logPath = await logger.writeToFile();

  console.log(finalText);
  console.log(JSON.stringify(evaluation, null, 2));
  console.log(`regular_log_file=${logPath}`);
} catch (error) {
  logger.error("run_failed", "Scenario 1 regular benchmark failed", {
    error: error instanceof Error ? error.message : String(error),
  });
  logger.finish({
    didFailTest: true,
    error: error instanceof Error ? error.message : String(error),
  });
  await logger.writeToFile();
  throw error;
} finally {
  await closeScenario1DbPool();
}
