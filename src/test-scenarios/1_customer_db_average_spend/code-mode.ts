import { createInitialState } from "@openrouter/agent";
import {
  BenchmarkLogger,
  findPairedBenchmarkLog,
  getOrCreateBenchmarkPairId,
  markBenchmarkPairLog,
  writeScenarioFinalComparison,
} from "../../lib/benchmark-logger.js";
import { type Model, openrouter } from "../../lib/chat-generation.js";
import { extractResponseText } from "../../lib/openrouter-response.js";
import { PROMPTS } from "../../lib/prompts.js";
import {
  closeScenario1DbPool,
  computeScenario1ExpectedResult,
} from "./data.js";
import { evaluateScenario1Run } from "./evaluation.js";
import { executeScenario1Code } from "./code-mode-tools.js";
import {
  createRunId,
  defaultScenario1Model,
  modelCallTimeoutMs,
  scenario1BenchmarkId,
  scenario1Number,
  withTimeout,
} from "./shared.js";

const model: Model = defaultScenario1Model;
const runId = createRunId();
const pairId = await getOrCreateBenchmarkPairId({
  scenarioNumber: scenario1Number,
  model,
});

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
  mode: "code-mode",
  model,
  pairId,
  runId,
  pricing: BenchmarkLogger.getDefaultPricing(),
});

try {
  logger.info("run_start", "Scenario 1 code-mode benchmark started", {
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

  const codeModePrompt = `${PROMPTS.systemPrompt}\n\nYou are now in code-mode.\nWrite TypeScript code that uses ONLY the provided tool execute_scenario1_code.\nWhen calling the tool, pass a full TS program string in input key \"typescript\".\nIn that program, use the provided global \"api\" methods:\n- await api.getCurrentDatetime()\n- await api.getAllCustomers({ limit, offset })\n- await api.searchCustomersByName({ query, limit })\n- await api.listTransactionsInWindow({ fromIso, toIso, customerId?, limit })\n- await api.computeCustomerSpendStats({ customerId, fromIso, toIso })\nThe TS program must return JSON object with keys:\n{ topCustomerId, topCustomerName, transactionCount, totalSpend, averageSpend, fromIso, toIso }\nDo not mention placeholders. Compute the real answer and return concise final JSON.`;

  const modelResult = openrouter.callModel({
    model,
    input: [
      { role: "system", content: codeModePrompt },
      { role: "user", content: PROMPTS.scenario1 },
    ],
    tools: [executeScenario1Code] as const,
    state: stateAccessor,
  });

  const response = await withTimeout(
    "code-mode response",
    modelResult.getResponse(),
    modelCallTimeoutMs
  );
  const finalText = extractResponseText(response);
  logger.addModelResponse("code_mode", finalText, response.usage);

  const toolCalls = await withTimeout(
    "code-mode tool calls",
    modelResult.getToolCalls(),
    modelCallTimeoutMs
  );

  logger.addToolCalls(
    "code_mode",
    toolCalls.map((call) => ({ name: call.name, arguments: call.arguments }))
  );

  const evaluation = evaluateScenario1Run({
    mode: "code-mode",
    calledToolNames: toolCalls.map((call) => call.name),
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
    mode: "code-mode",
    logPath,
  });

  const latestRegular = await findPairedBenchmarkLog({
    scenarioNumber: scenario1Number,
    model,
    pairId,
    mode: "regular",
  });

  if (latestRegular) {
    const final = await writeScenarioFinalComparison({
      benchmarkId: scenario1BenchmarkId,
      scenarioNumber: scenario1Number,
      model,
      pairId,
      runId,
      regular: latestRegular,
      codeMode: logger.toJSON(),
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
      "No paired regular log found yet; final comparison file not written"
    );
  }

  console.log(finalText);
  console.log(JSON.stringify(evaluation, null, 2));
  console.log(`code_mode_log_file=${logPath}`);
} catch (error) {
  logger.error("run_failed", "Scenario 1 code-mode benchmark failed", {
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
