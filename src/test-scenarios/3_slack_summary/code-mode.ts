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
import { evaluateScenario3Run } from "./evaluation.js";
import {
  consumeLastScenario3CodeExecution,
  executeScenario3Code,
} from "./code-mode-tools.js";
import { defaultScenario3Model, scenario3BenchmarkId, scenario3Number } from "./shared.js";
import { createRunId, modelCallTimeoutMs, withTimeout } from "../1_customer_db_average_spend/shared.js";

const cleanToolName = (value: string) =>
  value.replace(/<\|[^|]+\|>\w*/g, "").trim();

const scenario3SearchApiDefinition = createSearchApiDefinitionTool({
  scenarioLabel: "Scenario 3",
  definitions: [
    {
      apiName: "getTargetChannel",
      definition: "getTargetChannel(): Promise<{ channelId: string }>",
    },
    {
      apiName: "summarizeChannel",
      definition:
        "summarizeChannel({ channelId?, fromIso?, toIso? }): Promise<{ channelId, fromIso, toIso, summary, topics, actionItems }>",
    },
  ],
});

const scenario3CodeModeProgressivePrompt = buildProgressiveCodeModeSystemPrompt({
  scenarioLabel: "Scenario 3",
  apiNames: ["getTargetChannel", "summarizeChannel"],
  resultShapeInstruction:
    "Write TypeScript and call execute_scenario3_code with key { typescript }. The code must return exactly { channelId, fromIso, toIso, summary, topics, actionItems }.",
});

function hasValidResultShape(result: unknown) {
  return (
    typeof result === "object" &&
    result !== null &&
    typeof (result as { channelId?: unknown }).channelId === "string" &&
    typeof (result as { fromIso?: unknown }).fromIso === "string" &&
    typeof (result as { toIso?: unknown }).toIso === "string" &&
    typeof (result as { summary?: unknown }).summary === "string" &&
    Array.isArray((result as { topics?: unknown }).topics) &&
    Array.isArray((result as { actionItems?: unknown }).actionItems)
  );
}

export async function runScenario3CodeMode(model: Model = defaultScenario3Model) {
  const codeModeToolStrategy = env.CODE_MODE_TOOL_STRATEGY;
  const useProgressiveApiDiscovery = codeModeToolStrategy === "progressive-discovery";

  const runId = createRunId();
  const pairId = await getOrCreateBenchmarkPairId({
    scenarioNumber: scenario3Number,
    model,
  });

  let state = createInitialState();

  const logger = new BenchmarkLogger({
    benchmarkId: scenario3BenchmarkId,
    scenarioNumber: scenario3Number,
    mode: "code-mode",
    codeModeToolStrategy,
    model,
    pairId,
    runId,
    pricing: BenchmarkLogger.getDefaultPricing(),
  });
  logger.printBenchmarkHeader();

  try {
    logger.info("run_start", "Scenario 3 code-mode benchmark started", {
      benchmarkId: scenario3BenchmarkId,
      model,
      codeModeToolStrategy,
      modelCallTimeoutMs,
    });

    const codeModeSystemPrompt = useProgressiveApiDiscovery
      ? scenario3CodeModeProgressivePrompt
      : PROMPTS.scenario3CodeModeSystem;
    const codeModeTools = useProgressiveApiDiscovery
      ? ([scenario3SearchApiDefinition, executeScenario3Code] as const)
      : ([executeScenario3Code] as const);

    const allToolCalls: Array<{ name: string; arguments: unknown }> = [];
    let finalResultFromTool: Record<string, unknown> | null = null;
    let latestTextForEvaluation = "";

    const prompts = [
      PROMPTS.scenario3,
      useProgressiveApiDiscovery
        ? "Retry now. First call search_api_definition for APIs you will use, then call execute_scenario3_code with corrected TypeScript using api.<name>(...) only."
        : "Retry now and fix TypeScript syntax. Call execute_scenario3_code again.",
      useProgressiveApiDiscovery
        ? "Retry again. Mandatory: search_api_definition first, then execute_scenario3_code. Use only api.<name>(...) and return exact required fields."
        : "Retry again. Keep the code minimal and valid. Call execute_scenario3_code.",
    ];

    for (let attemptIndex = 0; attemptIndex < prompts.length; attemptIndex += 1) {
      const stage = attemptIndex === 0 ? "code_mode" : `code_mode_retry_${attemptIndex}`;
      const attemptPrompt = prompts[attemptIndex] ?? PROMPTS.scenario3;

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

      const execution = consumeLastScenario3CodeExecution();
      if (execution?.ok && execution.result) {
        finalResultFromTool = execution.result as unknown as Record<string, unknown>;
        const expectedToolName = "execute_scenario3_code";
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
          fallbackToolName: "execute_scenario3_code",
        })
      : allToolCalls.map((call) => call.name);

    const evaluation = evaluateScenario3Run({
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
      scenarioNumber: scenario3Number,
      model,
      pairId,
      mode: "code-mode",
      logPath,
    });

    const regular = await findPairedBenchmarkLog({
      scenarioNumber: scenario3Number,
      model,
      pairId,
      mode: "regular",
    });

    if (regular) {
      const comparison = await writeScenarioFinalComparison({
        benchmarkId: scenario3BenchmarkId,
        scenarioNumber: scenario3Number,
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

    console.log(`scenario3_code_mode_log_file=${logPath}`);
  } catch (error) {
    logger.error("run_failed", "Scenario 3 code-mode benchmark failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    logger.finish({ didFailTest: true, error: error instanceof Error ? error.message : String(error) });
    logger.printBenchmarkSummary();
    await logger.writeToFile();
    throw error;
  }
}

if (import.meta.main) {
  await runScenario3CodeMode();
}
