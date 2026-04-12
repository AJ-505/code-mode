import { createInitialState, stepCountIs } from "@openrouter/agent";
import {
  BenchmarkLogger,
  findPairedBenchmarkLog,
  getOrCreateBenchmarkPairId,
  markBenchmarkPairLog,
  writeScenarioFinalComparison,
} from "../../lib/benchmark-logger.js";
import { type Model, openrouter } from "../../lib/chat-generation.js";
import { extractResponseText } from "../../lib/openrouter-response.js";
import {
  discoverTools,
  getProgressiveToolsByName,
  registerProgressiveTools,
} from "../../lib/progressive-tool-discovery.js";
import { PROMPTS } from "../../lib/prompts.js";
import { evaluateScenario3Run } from "./evaluation.js";
import { defaultScenario3Model, scenario3BenchmarkId, scenario3Number } from "./shared.js";
import { benchmark3Tools } from "./tools.js";
import { createRunId, modelCallTimeoutMs, withTimeout } from "../1_customer_db_average_spend/shared.js";

const cleanToolName = (value: string) =>
  value.replace(/<\|[^|]+\|>\w*/g, "").trim();

export async function runScenario3Regular(model: Model = defaultScenario3Model) {
  registerProgressiveTools([...benchmark3Tools]);

  const runId = createRunId();
  const pairId = await getOrCreateBenchmarkPairId({
    scenarioNumber: scenario3Number,
    model,
  });

  let state = createInitialState();

  const logger = new BenchmarkLogger({
    benchmarkId: scenario3BenchmarkId,
    scenarioNumber: scenario3Number,
    mode: "regular",
    model,
    pairId,
    runId,
    pricing: BenchmarkLogger.getDefaultPricing(),
  });

  try {
    logger.info("run_start", "Scenario 3 regular benchmark started", {
      benchmarkId: scenario3BenchmarkId,
      model,
      modelCallTimeoutMs,
    });

    const discovery = openrouter.callModel({
      model,
      input: [
        {
          role: "system",
          content: `${PROMPTS.systemPrompt}\nDiscovery stage only: call discover_tools for summarize_slack_channel.`,
        },
        { role: "user", content: PROMPTS.scenario3 },
      ],
      tools: [discoverTools] as const,
      state: {
        load: async () => state,
        save: async (next) => {
          state = next;
        },
      },
      stopWhen: stepCountIs(1),
      temperature: 0,
    });

    const discoveryResponse = await withTimeout(
      "scenario3 regular discovery response",
      discovery.getResponse(),
      modelCallTimeoutMs
    );
    logger.addModelResponse(
      "discovery",
      extractResponseText(discoveryResponse),
      discoveryResponse.usage
    );

    const discoveryCallsRaw = await withTimeout(
      "scenario3 regular discovery tool calls",
      discovery.getToolCalls(),
      modelCallTimeoutMs
    );

    const discoveryCalls = discoveryCallsRaw.map((call) => ({
      name: cleanToolName(call.name),
      arguments: call.arguments,
    }));
    logger.addToolCalls("discovery", discoveryCalls);

    const unlocked = getProgressiveToolsByName(["summarize_slack_channel"]);

    const execution = openrouter.callModel({
      model,
      input: [
        {
          role: "system",
          content: `${PROMPTS.systemPrompt}\nExecution stage only. Use summarize_slack_channel and return strict JSON.`,
        },
        { role: "user", content: PROMPTS.scenario3 },
      ],
      tools: unlocked,
      state: {
        load: async () => state,
        save: async (next) => {
          state = next;
        },
      },
      stopWhen: stepCountIs(4),
      temperature: 0,
    });

    const executionResponse = await withTimeout(
      "scenario3 regular execution response",
      execution.getResponse(),
      modelCallTimeoutMs
    );
    const finalText = extractResponseText(executionResponse);
    logger.addModelResponse("execution", finalText, executionResponse.usage);

    const executionCallsRaw = await withTimeout(
      "scenario3 regular execution tool calls",
      execution.getToolCalls(),
      modelCallTimeoutMs
    );
    const executionCalls = executionCallsRaw.map((call) => ({
      name: cleanToolName(call.name),
      arguments: call.arguments,
    }));
    logger.addToolCalls("execution", executionCalls);

    const evaluation = evaluateScenario3Run({
      mode: "regular",
      calledToolNames: [...discoveryCalls, ...executionCalls].map((call) => call.name),
      finalText,
    });

    logger.setEvaluation(evaluation as unknown as Record<string, unknown>);
    logger.finish({ didFailTest: !evaluation.overallPass });

    const logPath = await logger.writeToFile();
    await markBenchmarkPairLog({
      scenarioNumber: scenario3Number,
      model,
      pairId,
      mode: "regular",
      logPath,
    });

    const codeMode = await findPairedBenchmarkLog({
      scenarioNumber: scenario3Number,
      model,
      pairId,
      mode: "code-mode",
    });

    if (codeMode) {
      const comparison = await writeScenarioFinalComparison({
        benchmarkId: scenario3BenchmarkId,
        scenarioNumber: scenario3Number,
        model,
        pairId,
        runId,
        regular: logger.toJSON(),
        codeMode,
      });
      logger.setComparison({
        winner: comparison.comparison.winner,
        reasons: comparison.comparison.reasons,
      });
    }

    console.log(`scenario3_regular_log_file=${logPath}`);
  } catch (error) {
    logger.error("run_failed", "Scenario 3 regular benchmark failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    logger.finish({ didFailTest: true, error: error instanceof Error ? error.message : String(error) });
    await logger.writeToFile();
    throw error;
  }
}

if (import.meta.main) {
  await runScenario3Regular();
}
