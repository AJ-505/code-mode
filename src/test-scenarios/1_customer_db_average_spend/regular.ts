import { stepCountIs } from "@openrouter/agent";
import {
  BenchmarkLogger,
  findPairedBenchmarkLog,
  getOrCreateBenchmarkPairId,
  markBenchmarkPairLog,
  writeScenarioFinalComparison,
} from "../../lib/benchmark-logger.js";
import { type Model, openrouter } from "../../lib/chat-generation.js";
import {
  extractResponseText,
} from "../../lib/openrouter-response.js";
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

export async function runRegularBenchmark(model: Model = defaultScenario1Model) {
  const runId = createRunId();
  const pairId = await getOrCreateBenchmarkPairId({
    scenarioNumber: scenario1Number,
    model,
  });

  registerProgressiveTools([...benchmark1Tools]);

  const logger = new BenchmarkLogger({
    benchmarkId: scenario1BenchmarkId,
    scenarioNumber: scenario1Number,
    mode: "regular",
    model,
    pairId,
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
  logger.logExpectedResult(expected as unknown as Record<string, unknown>);
  logger.info("expected_result", "Computed scenario expected result from DB seed", {
    topCustomerId: expected.topCustomerId,
    transactionCount: expected.transactionCount,
    averageSpend: expected.averageSpend,
  });

  const discoverySystemPrompt = `${PROMPTS.systemPrompt}\nDiscovery stage only. You have exactly one callable tool in this stage: discover_tools.\nCall discover_tools exactly once with these tool names: [\"get_current_datetime\", \"get_all_customers\", \"list_transactions_in_window\", \"compute_customer_spend_stats\"].\nDo not call any other tool in this stage.`;
  const discoveryUserPrompt =
    "Scenario 1: find the customer with most transactions in the last 7 days and their average spend. In this stage, only run discover_tools.";

  logger.logPrompts("discovery", {
    systemPrompt: discoverySystemPrompt,
    userPrompt: discoveryUserPrompt,
  });

  const discoveryResult = openrouter.callModel({
    model,
    input: [
      {
        role: "system",
        content: discoverySystemPrompt,
      },
      {
        role: "user",
        content: discoveryUserPrompt,
      },
    ],
    tools: [discoverTools] as const,
    stopWhen: stepCountIs(1),
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

  let discovered = extractDiscoveredToolNames(discoveryCalls);
  let unlocked = getProgressiveToolsByName(discovered);

  if (unlocked.length === 0) {
    logger.info(
      "discovery_retry",
      "No discover_tools call found in first attempt; retrying discovery once"
    );

    const retryDiscoveryResult = openrouter.callModel({
      model,
      input: [
        {
          role: "system",
          content: `${PROMPTS.systemPrompt}\nMandatory action: call discover_tools now. No prose.`,
        },
        {
          role: "user",
          content:
            "Call discover_tools with [\"get_current_datetime\", \"get_all_customers\", \"list_transactions_in_window\", \"compute_customer_spend_stats\"] right now.",
        },
      ],
      tools: [discoverTools] as const,
      stopWhen: stepCountIs(1),
    });

    const retryResponse = await withTimeout(
      "regular retry discovery response",
      retryDiscoveryResult.getResponse(),
      modelCallTimeoutMs
    );
    const retryText = extractResponseText(retryResponse);
    logger.addModelResponse("discovery_retry", retryText, retryResponse.usage);

    const retryCalls = await withTimeout(
      "regular retry discovery tool calls",
      retryDiscoveryResult.getToolCalls(),
      modelCallTimeoutMs
    );
    logger.addToolCalls(
      "discovery_retry",
      retryCalls.map((call) => ({ name: call.name, arguments: call.arguments }))
    );

    discoveryCalls.push(...retryCalls);
    discovered = extractDiscoveredToolNames(discoveryCalls);
    unlocked = getProgressiveToolsByName(discovered);
  }

  const toolsForExecution =
    unlocked.length > 0
      ? unlocked
      : getProgressiveToolsByName(getAllRegisteredProgressiveToolNames());

  logger.info("execution_stage", "Starting regular execution stage", {
    discoveredTools: discovered,
    unlockedToolCount: unlocked.length,
    executionToolCount: toolsForExecution.length,
    executionToolNames: toolsForExecution
      .filter((tool) => tool.type === "function")
      .map((tool) => tool.function.name),
  });

  const executionSystemPrompt = `${PROMPTS.systemPrompt}\nExecution stage only.\nYou have these tools: get_current_datetime, get_all_customers, list_transactions_in_window, compute_customer_spend_stats, search_customers_by_name.\nUse this strategy:\n1) get_current_datetime\n2) list_transactions_in_window for last 7 days (no customerId)\n3) determine top customer by highest transaction count from that returned list\n4) compute_customer_spend_stats for that top customer and same date window\nReturn STRICT JSON only with keys: topCustomerId, topCustomerName, transactionCount, totalSpend, averageSpend, fromIso, toIso.\nNo markdown. No extra text.`;
  const executionUserPrompt = PROMPTS.scenario1;

  logger.logPrompts("execution", {
    systemPrompt: executionSystemPrompt,
    userPrompt: executionUserPrompt,
  });

  const executionResult = openrouter.callModel({
    model,
    input: [
      {
        role: "system",
        content: executionSystemPrompt,
      },
      {
        role: "user",
        content: executionUserPrompt,
      },
    ],
    tools: toolsForExecution,
    stopWhen: stepCountIs(12),
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

  const logPath = await logger.writeToFile();
  await markBenchmarkPairLog({
    scenarioNumber: scenario1Number,
    model,
    pairId,
    mode: "regular",
    logPath,
  });

  const latestCodeMode = await findPairedBenchmarkLog({
    scenarioNumber: scenario1Number,
    model,
    pairId,
    mode: "code-mode",
  });

  if (latestCodeMode) {
    const final = await writeScenarioFinalComparison({
      benchmarkId: scenario1BenchmarkId,
      scenarioNumber: scenario1Number,
      model,
      pairId,
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
      "No paired code-mode log found yet; final comparison file not written"
    );
  }

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
}

if (import.meta.main) {
  await runRegularBenchmark();
}
