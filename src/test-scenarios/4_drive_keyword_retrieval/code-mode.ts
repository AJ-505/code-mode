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
import { evaluateScenario4Run } from "./evaluation.js";
import {
  consumeLastScenario4CodeExecution,
  executeScenario4Code,
} from "./code-mode-tools.js";
import { defaultScenario4Model, scenario4BenchmarkId, scenario4Number } from "./shared.js";
import { createRunId, modelCallTimeoutMs, withTimeout } from "../1_customer_db_average_spend/shared.js";

const cleanToolName = (value: string) =>
  value.replace(/<\|[^|]+\|>\w*/g, "").trim();

function hasValidResultShape(result: unknown) {
  return (
    typeof result === "object" &&
    result !== null &&
    typeof (result as { query?: unknown }).query === "string" &&
    typeof (result as { speaker?: unknown }).speaker === "string" &&
    typeof (result as { date?: unknown }).date === "string" &&
    Array.isArray((result as { matches?: unknown }).matches)
  );
}

function parseResultFromStdout(stdout: string[] | undefined) {
  if (!stdout) return null;

  for (const chunk of [...stdout].reverse()) {
    try {
      const parsed = JSON.parse(chunk) as unknown;
      if (hasValidResultShape(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export async function runScenario4CodeMode(model: Model = defaultScenario4Model) {
  const runId = createRunId();
  const pairId = await getOrCreateBenchmarkPairId({
    scenarioNumber: scenario4Number,
    model,
  });

  let state = createInitialState();

  const logger = new BenchmarkLogger({
    benchmarkId: scenario4BenchmarkId,
    scenarioNumber: scenario4Number,
    mode: "code-mode",
    model,
    pairId,
    runId,
    pricing: BenchmarkLogger.getDefaultPricing(),
  });

  try {
    logger.info("run_start", "Scenario 4 code-mode benchmark started", {
      benchmarkId: scenario4BenchmarkId,
      model,
      modelCallTimeoutMs,
    });

    const allToolCalls: Array<{ name: string; arguments: unknown }> = [];
    let finalResultFromTool: Record<string, unknown> | null = null;
    let latestTextForEvaluation = "";

    const prompts = [
      PROMPTS.scenario4,
      "Retry now and fix TypeScript syntax. Call execute_scenario4_code again.",
      "Retry again. Keep the code minimal and valid. Call execute_scenario4_code.",
    ];

    for (let attemptIndex = 0; attemptIndex < prompts.length; attemptIndex += 1) {
      const stage = attemptIndex === 0 ? "code_mode" : `code_mode_retry_${attemptIndex}`;
      const attemptPrompt = prompts[attemptIndex] ?? PROMPTS.scenario4;

      logger.logPrompts(stage, {
        systemPrompt: PROMPTS.scenario4CodeModeSystem,
        userPrompt: attemptPrompt,
      });

      const result = openrouter.callModel({
        model,
        input:
          attemptIndex === 0
            ? [
                { role: "system", content: PROMPTS.scenario4CodeModeSystem },
                { role: "user", content: attemptPrompt },
              ]
            : [{ role: "user", content: attemptPrompt }],
        tools: [executeScenario4Code] as const,
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

      const execution = consumeLastScenario4CodeExecution();
      const stdoutFallback = parseResultFromStdout(execution?.stdout);
      if ((execution?.ok && execution.result) || stdoutFallback) {
        finalResultFromTool = stdoutFallback ?? (execution?.result as unknown as Record<string, unknown>);
        const expectedToolName = "execute_scenario4_code";
        if (!allToolCalls.some((call) => call.name === expectedToolName)) {
          const syntheticCall = {
            name: expectedToolName,
            arguments: {
              synthetic: true,
              source: stdoutFallback ? "stdout_result_event" : "tool_result_event",
            },
          };
          allToolCalls.push(syntheticCall);
          logger.addToolCalls(stage, [syntheticCall]);
        }
        logger.info("tool_result", "Code execution result from tool", {
          ...(finalResultFromTool ?? {}),
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

    const evaluation = evaluateScenario4Run({
      mode: "code-mode",
      calledToolNames: allToolCalls.map((call) => call.name),
      finalText: finalAnswerText,
    });

    logger.setEvaluation(evaluation as unknown as Record<string, unknown>);
    logger.finish({ didFailTest: !evaluation.overallPass });

    const logPath = await logger.writeToFile();
    await markBenchmarkPairLog({
      scenarioNumber: scenario4Number,
      model,
      pairId,
      mode: "code-mode",
      logPath,
    });

    const regular = await findPairedBenchmarkLog({
      scenarioNumber: scenario4Number,
      model,
      pairId,
      mode: "regular",
    });

    if (regular) {
      const comparison = await writeScenarioFinalComparison({
        benchmarkId: scenario4BenchmarkId,
        scenarioNumber: scenario4Number,
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

    console.log(`scenario4_code_mode_log_file=${logPath}`);
  } catch (error) {
    logger.error("run_failed", "Scenario 4 code-mode benchmark failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    logger.finish({ didFailTest: true, error: error instanceof Error ? error.message : String(error) });
    await logger.writeToFile();
    throw error;
  }
}

if (import.meta.main) {
  await runScenario4CodeMode();
}
