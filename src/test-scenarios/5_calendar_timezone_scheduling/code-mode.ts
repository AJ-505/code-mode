import { createInitialState, stepCountIs } from "@openrouter/agent";
import {
  BenchmarkLogger,
  findPairedBenchmarkLog,
  getOrCreateBenchmarkPairId,
  markBenchmarkPairLog,
  writeScenarioFinalComparison,
} from "../../lib/benchmark-logger.js";
import { type Model, openrouter } from "../../lib/chat-generation.js";
import { env } from "../../env.js";
import {
  buildProgressiveCodeModeSystemPrompt,
  createSearchApiDefinitionTool,
  ensureProgressiveSearchToolCall,
} from "../../lib/code-mode-api-discovery.js";
import { extractResponseText, isInvalidFinalResponseError } from "../../lib/openrouter-response.js";
import { PROMPTS } from "../../lib/prompts.js";
import { evaluateScenario5Run } from "./evaluation.js";
import {
  consumeLastScenario5CodeExecution,
  executeScenario5Code,
} from "./code-mode-tools.js";
import { defaultScenario5Model, scenario5BenchmarkId, scenario5Number } from "./shared.js";
import { createRunId, modelCallTimeoutMs, withTimeout } from "../1_customer_db_average_spend/shared.js";

const cleanToolName = (value: string) =>
  value.replace(/<\|[^|]+\|>\w*/g, "").trim();

const scenario5SearchApiDefinition = createSearchApiDefinitionTool({
  scenarioLabel: "Scenario 5",
  definitions: [
    {
      apiName: "getSchedulingContext",
      definition:
        "getSchedulingContext(): Promise<{ localTimezone, boliviaTimezone, localWorkingHours, boliviaWorkingHours, localBusySlots, boliviaBusySlots }>",
    },
    {
      apiName: "proposeMeetingSlot",
      definition:
        "proposeMeetingSlot({ localTimezone?, boliviaTimezone? }): Promise<{ proposedStartIso, proposedEndIso, localTimezone, boliviaTimezone, rationale }>",
    },
  ],
});

const scenario5CodeModeProgressivePrompt = buildProgressiveCodeModeSystemPrompt({
  scenarioLabel: "Scenario 5",
  apiNames: ["getSchedulingContext", "proposeMeetingSlot"],
  resultShapeInstruction:
    "Write TypeScript and call execute_scenario5_code with key { typescript }. The code must return exactly { proposedStartIso, proposedEndIso, localTimezone, boliviaTimezone, rationale }.",
});

function hasValidResultShape(result: unknown) {
  return (
    typeof result === "object" &&
    result !== null &&
    typeof (result as { proposedStartIso?: unknown }).proposedStartIso === "string" &&
    typeof (result as { proposedEndIso?: unknown }).proposedEndIso === "string" &&
    typeof (result as { localTimezone?: unknown }).localTimezone === "string" &&
    typeof (result as { boliviaTimezone?: unknown }).boliviaTimezone === "string" &&
    typeof (result as { rationale?: unknown }).rationale === "string"
  );
}

export async function runScenario5CodeMode(model: Model = defaultScenario5Model) {
  const codeModeToolStrategy = env.CODE_MODE_TOOL_STRATEGY;
  const useProgressiveApiDiscovery = codeModeToolStrategy === "progressive-discovery";

  const runId = createRunId();
  const pairId = await getOrCreateBenchmarkPairId({
    scenarioNumber: scenario5Number,
    model,
  });

  let state = createInitialState();

  const logger = new BenchmarkLogger({
    benchmarkId: scenario5BenchmarkId,
    scenarioNumber: scenario5Number,
    mode: "code-mode",
    codeModeToolStrategy,
    model,
    pairId,
    runId,
    pricing: BenchmarkLogger.getDefaultPricing(),
  });
  logger.printBenchmarkHeader();

  try {
    logger.info("run_start", "Scenario 5 code-mode benchmark started", {
      benchmarkId: scenario5BenchmarkId,
      model,
      codeModeToolStrategy,
      modelCallTimeoutMs,
    });

    const codeModeSystemPrompt = useProgressiveApiDiscovery
      ? scenario5CodeModeProgressivePrompt
      : PROMPTS.scenario5CodeModeSystem;
    const codeModeTools = useProgressiveApiDiscovery
      ? ([scenario5SearchApiDefinition, executeScenario5Code] as const)
      : ([executeScenario5Code] as const);

    const allToolCalls: Array<{ name: string; arguments: unknown }> = [];
    let finalResultFromTool: Record<string, unknown> | null = null;
    let latestTextForEvaluation = "";

    const prompts = [
      PROMPTS.scenario5,
      useProgressiveApiDiscovery
        ? "Retry now. First call search_api_definition for APIs you will use, then call execute_scenario5_code with corrected TypeScript using api.<name>(...) only."
        : "Retry now and fix TypeScript syntax. Call execute_scenario5_code again.",
      useProgressiveApiDiscovery
        ? "Retry again. Mandatory: search_api_definition first, then execute_scenario5_code. Use only api.<name>(...) and return exact required fields."
        : "Retry again. Keep the code minimal and valid. Call execute_scenario5_code.",
    ];

    for (let attemptIndex = 0; attemptIndex < prompts.length; attemptIndex += 1) {
      const stage = attemptIndex === 0 ? "code_mode" : `code_mode_retry_${attemptIndex}`;
      const attemptPrompt = prompts[attemptIndex] ?? PROMPTS.scenario5;

      logger.logPrompts(stage, {
        systemPrompt: codeModeSystemPrompt,
        userPrompt: attemptPrompt,
      });

      const result = openrouter.callModel({
        model,
        input:
          attemptIndex === 0
            ? [
                { role: "system", content: codeModeSystemPrompt },
                { role: "user", content: attemptPrompt },
              ]
            : [{ role: "user", content: attemptPrompt }],
        tools: codeModeTools,
        state: {
          load: async () => state,
          save: async (next) => {
            state = next;
          },
        },
        temperature: 0,
        maxOutputTokens: 900,
        stopWhen: stepCountIs(4),
      });

      let finalText = "";
      let responseUsage: Parameters<BenchmarkLogger["addModelResponse"]>[2] = undefined;
      try {
        const response = await withTimeout(
          `${stage} response`,
          result.getResponse(),
          modelCallTimeoutMs
        );
        finalText = extractResponseText(response);
        responseUsage = response.usage;
      } catch (error) {
        if (!isInvalidFinalResponseError(error)) throw error;
        logger.info(
          "code_mode_response_empty",
          `Model response had empty final output for ${stage}; continuing with tool execution output`,
          {
            error: error instanceof Error ? error.message : String(error),
          }
        );
      }
      latestTextForEvaluation = finalText || latestTextForEvaluation;
      logger.addModelResponse(stage, finalText, responseUsage);

      const toolCallsRaw = await withTimeout(
        `${stage} tool calls`,
        result.getToolCalls(),
        modelCallTimeoutMs
      );
      const toolCalls = toolCallsRaw.map((call) => ({
        name: cleanToolName(call.name),
        arguments: call.arguments,
      }));
      allToolCalls.push(...toolCalls);
      logger.addToolCalls(stage, toolCalls);

      const execution = consumeLastScenario5CodeExecution();
      if (execution?.ok && execution.result) {
        finalResultFromTool = execution.result as unknown as Record<string, unknown>;
        const expectedToolName = "execute_scenario5_code";
        if (!allToolCalls.some((call) => call.name === expectedToolName)) {
          const syntheticCall = {
            name: expectedToolName,
            arguments: { synthetic: true, source: "tool_result_event" },
          };
          allToolCalls.push(syntheticCall);
          logger.addToolCalls(stage, [syntheticCall]);
        }
        logger.info("tool_result", "Code execution result from tool", {
          ...execution.result,
        });
        break;
      }

      logger.info("tool_result", "Code execution failed inside tool", {
        error: execution?.error ?? "(no execution output captured)",
        stdout: execution?.stdout?.join(" | ") ?? "",
      });
    }

    const finalAnswerText = hasValidResultShape(finalResultFromTool)
      ? JSON.stringify(finalResultFromTool)
      : latestTextForEvaluation;

    logger.info("tool_activity", "Tool calls captured", {
      count: allToolCalls.length,
      names:
        allToolCalls.length > 0
          ? allToolCalls.map((call) => call.name).join(", ")
          : "(none)",
    });

    const calledToolNames = useProgressiveApiDiscovery
      ? ensureProgressiveSearchToolCall({
          calledToolNames: allToolCalls.map((call) => call.name),
          fallbackToolName: "execute_scenario5_code",
        })
      : allToolCalls.map((call) => call.name);

    const evaluation = evaluateScenario5Run({
      mode: "code-mode",
      codeModeToolStrategy,
      calledToolNames,
      finalText: finalAnswerText,
    });

    logger.setEvaluation(evaluation as unknown as Record<string, unknown>);
    logger.finish({ didFailTest: !evaluation.overallPass });
    logger.printBenchmarkSummary();

    const logPath = await logger.writeToFile();
    await markBenchmarkPairLog({
      scenarioNumber: scenario5Number,
      model,
      pairId,
      mode: "code-mode",
      logPath,
    });

    const regular = await findPairedBenchmarkLog({
      scenarioNumber: scenario5Number,
      model,
      pairId,
      mode: "regular",
    });

    if (regular) {
      const comparison = await writeScenarioFinalComparison({
        benchmarkId: scenario5BenchmarkId,
        scenarioNumber: scenario5Number,
        model,
        pairId,
        runId,
        regular,
        codeMode: logger.toJSON(),
      });

      logger.setComparison({
        winner: comparison.comparison.winner,
        reasons: comparison.comparison.reasons,
      });
    }

    console.log(`scenario5_code_mode_log_file=${logPath}`);
  } catch (error) {
    logger.error("run_failed", "Scenario 5 code-mode benchmark failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    logger.finish({ didFailTest: true, error: error instanceof Error ? error.message : String(error) });
    logger.printBenchmarkSummary();
    await logger.writeToFile();
    throw error;
  }
}

if (import.meta.main) {
  await runScenario5CodeMode();
}
