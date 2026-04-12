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
import { evaluateScenario2Run } from "./evaluation.js";
import { defaultScenario2Model, scenario2BenchmarkId, scenario2Number } from "./shared.js";
import { benchmark2Tools } from "./tools.js";
import { createRunId, modelCallTimeoutMs, withTimeout } from "../1_customer_db_average_spend/shared.js";

const cleanToolName = (value: string) =>
  value.replace(/<\|[^|]+\|>\w*/g, "").trim();

export async function runScenario2Regular(model: Model = defaultScenario2Model) {
  registerProgressiveTools([...benchmark2Tools]);

  const runId = createRunId();
  const pairId = await getOrCreateBenchmarkPairId({
    scenarioNumber: scenario2Number,
    model,
  });

  let state = createInitialState();

  const logger = new BenchmarkLogger({
    benchmarkId: scenario2BenchmarkId,
    scenarioNumber: scenario2Number,
    mode: "regular",
    model,
    pairId,
    runId,
    pricing: BenchmarkLogger.getDefaultPricing(),
  });

  try {
    logger.info("run_start", "Scenario 2 regular benchmark started", {
      benchmarkId: scenario2BenchmarkId,
      model,
      modelCallTimeoutMs,
    });

    const discovery = openrouter.callModel({
      model,
      input: [
        {
          role: "system",
          content: `${PROMPTS.systemPrompt}\nDiscovery stage only: call discover_tools for audit_demo_site.`,
        },
        { role: "user", content: PROMPTS.scenario2 },
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
      "scenario2 regular discovery response",
      discovery.getResponse(),
      modelCallTimeoutMs
    );
    logger.addModelResponse(
      "discovery",
      extractResponseText(discoveryResponse),
      discoveryResponse.usage
    );

    const discoveryCallsRaw = await withTimeout(
      "scenario2 regular discovery tool calls",
      discovery.getToolCalls(),
      modelCallTimeoutMs
    );

    const discoveryCalls = discoveryCallsRaw.map((call) => ({
      name: cleanToolName(call.name),
      arguments: call.arguments,
    }));
    logger.addToolCalls("discovery", discoveryCalls);

    const unlocked = getProgressiveToolsByName(["audit_demo_site"]);

    const execution = openrouter.callModel({
      model,
      input: [
        {
          role: "system",
          content: `${PROMPTS.systemPrompt}\nExecution stage only. Use audit_demo_site and return strict JSON.`,
        },
        { role: "user", content: PROMPTS.scenario2 },
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
      "scenario2 regular execution response",
      execution.getResponse(),
      modelCallTimeoutMs
    );
    const finalText = extractResponseText(executionResponse);
    logger.addModelResponse("execution", finalText, executionResponse.usage);

    const executionCallsRaw = await withTimeout(
      "scenario2 regular execution tool calls",
      execution.getToolCalls(),
      modelCallTimeoutMs
    );
    const executionCalls = executionCallsRaw.map((call) => ({
      name: cleanToolName(call.name),
      arguments: call.arguments,
    }));
    logger.addToolCalls("execution", executionCalls);

    const evaluation = evaluateScenario2Run({
      mode: "regular",
      calledToolNames: [...discoveryCalls, ...executionCalls].map((call) => call.name),
      finalText,
    });

    logger.setEvaluation(evaluation as unknown as Record<string, unknown>);
    logger.finish({ didFailTest: !evaluation.overallPass });

    const codeMode = await findPairedBenchmarkLog({
      scenarioNumber: scenario2Number,
      model,
      pairId,
      mode: "code-mode",
    });

    if (codeMode) {
      const comparison = await writeScenarioFinalComparison({
        benchmarkId: scenario2BenchmarkId,
        scenarioNumber: scenario2Number,
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

    const logPath = await logger.writeToFile();
    await markBenchmarkPairLog({
      scenarioNumber: scenario2Number,
      model,
      pairId,
      mode: "regular",
      logPath,
    });

    console.log(`scenario2_regular_log_file=${logPath}`);
  } catch (error) {
    logger.error("run_failed", "Scenario 2 regular benchmark failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    logger.finish({ didFailTest: true, error: error instanceof Error ? error.message : String(error) });
    await logger.writeToFile();
    throw error;
  }
}

if (import.meta.main) {
  await runScenario2Regular();
}
