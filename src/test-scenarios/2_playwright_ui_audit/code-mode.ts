import { createInitialState, stepCountIs } from "@openrouter/agent";
import {
  BenchmarkLogger,
  findPairedBenchmarkLog,
  getOrCreateBenchmarkPairId,
  markBenchmarkPairLog,
  writeScenarioFinalComparison,
} from "../../lib/benchmark-logger.js";
import { type Model, openrouter } from "../../lib/chat-generation.js";
import { extractResponseText, isInvalidFinalResponseError } from "../../lib/openrouter-response.js";
import { PROMPTS } from "../../lib/prompts.js";
import { evaluateScenario2Run } from "./evaluation.js";
import {
  consumeLastScenario2CodeExecution,
  executeScenario2Code,
} from "./code-mode-tools.js";
import { defaultScenario2Model, scenario2BenchmarkId, scenario2Number } from "./shared.js";
import { createRunId, modelCallTimeoutMs, withTimeout } from "../1_customer_db_average_spend/shared.js";

const cleanToolName = (value: string) =>
  value.replace(/<\|[^|]+\|>\w*/g, "").trim();

function hasValidResultShape(result: unknown) {
  return (
    typeof result === "object" &&
    result !== null &&
    typeof (result as { siteUrl?: unknown }).siteUrl === "string" &&
    Array.isArray((result as { findings?: unknown }).findings) &&
    typeof (result as { summary?: unknown }).summary === "string"
  );
}

export async function runScenario2CodeMode(model: Model = defaultScenario2Model) {
  const runId = createRunId();
  const pairId = await getOrCreateBenchmarkPairId({
    scenarioNumber: scenario2Number,
    model,
  });

  let state = createInitialState();

  const logger = new BenchmarkLogger({
    benchmarkId: scenario2BenchmarkId,
    scenarioNumber: scenario2Number,
    mode: "code-mode",
    model,
    pairId,
    runId,
    pricing: BenchmarkLogger.getDefaultPricing(),
  });

  try {
    logger.info("run_start", "Scenario 2 code-mode benchmark started", {
      benchmarkId: scenario2BenchmarkId,
      model,
      modelCallTimeoutMs,
    });

    const allToolCalls: Array<{ name: string; arguments: unknown }> = [];
    let finalResultFromTool: Record<string, unknown> | null = null;
    let latestTextForEvaluation = "";

    const prompts = [
      PROMPTS.scenario2,
      "Retry now and fix TypeScript syntax. Call execute_scenario2_code again.",
      "Retry again. Keep the code minimal and valid. Call execute_scenario2_code.",
    ];

    for (let attemptIndex = 0; attemptIndex < prompts.length; attemptIndex += 1) {
      const stage = attemptIndex === 0 ? "code_mode" : `code_mode_retry_${attemptIndex}`;
      const attemptPrompt = prompts[attemptIndex] ?? PROMPTS.scenario2;

      logger.logPrompts(stage, {
        systemPrompt: PROMPTS.scenario2CodeModeSystem,
        userPrompt: attemptPrompt,
      });

      const result = openrouter.callModel({
        model,
        input:
          attemptIndex === 0
            ? [
                { role: "system", content: PROMPTS.scenario2CodeModeSystem },
                { role: "user", content: attemptPrompt },
              ]
            : [{ role: "user", content: attemptPrompt }],
        tools: [executeScenario2Code] as const,
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

      const execution = consumeLastScenario2CodeExecution();
      if (execution?.ok && execution.result) {
        finalResultFromTool = execution.result as unknown as Record<string, unknown>;
        const expectedToolName = "execute_scenario2_code";
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

    const evaluation = evaluateScenario2Run({
      mode: "code-mode",
      calledToolNames: allToolCalls.map((call) => call.name),
      finalText: finalAnswerText,
    });

    logger.setEvaluation(evaluation as unknown as Record<string, unknown>);
    logger.finish({ didFailTest: !evaluation.overallPass });

    const logPath = await logger.writeToFile();
    await markBenchmarkPairLog({
      scenarioNumber: scenario2Number,
      model,
      pairId,
      mode: "code-mode",
      logPath,
    });

    const regular = await findPairedBenchmarkLog({
      scenarioNumber: scenario2Number,
      model,
      pairId,
      mode: "regular",
    });

    if (regular) {
      const comparison = await writeScenarioFinalComparison({
        benchmarkId: scenario2BenchmarkId,
        scenarioNumber: scenario2Number,
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

    console.log(`scenario2_code_mode_log_file=${logPath}`);
  } catch (error) {
    logger.error("run_failed", "Scenario 2 code-mode benchmark failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    logger.finish({ didFailTest: true, error: error instanceof Error ? error.message : String(error) });
    await logger.writeToFile();
    throw error;
  }
}

if (import.meta.main) {
  await runScenario2CodeMode();
}
