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
import {
  closeScenario1DbPool,
  computeScenario1ExpectedResult,
} from "./data.js";
import { evaluateScenario1Run } from "./evaluation.js";
import {
  consumeLastScenario1CodeExecution,
  executeScenario1Code,
} from "./code-mode-tools.js";
import {
  createRunId,
  defaultScenario1Model,
  modelCallTimeoutMs,
  scenario1BenchmarkId,
  scenario1Number,
  withTimeout,
} from "./shared.js";

const cleanToolName = (value: string) =>
  value.replace(/<\|[^|]+\|>\w*/g, "").trim();

function hasValidResultShape(result: unknown) {
  return (
    typeof result === "object" &&
    result !== null &&
    typeof (result as { topCustomerId?: unknown }).topCustomerId === "string" &&
    typeof (result as { topCustomerName?: unknown }).topCustomerName === "string" &&
    typeof (result as { transactionCount?: unknown }).transactionCount === "number" &&
    typeof (result as { totalSpend?: unknown }).totalSpend === "number" &&
    typeof (result as { averageSpend?: unknown }).averageSpend === "number" &&
    typeof (result as { fromIso?: unknown }).fromIso === "string" &&
    typeof (result as { toIso?: unknown }).toIso === "string"
  );
}

function normalizeToolCalls(
  calls: Array<{ name: string; arguments: unknown }>
): Array<{ name: string; arguments: unknown }> {
  return calls.map((call) => ({
    name: cleanToolName(call.name),
    arguments: call.arguments,
  }));
}

type AttemptResult = {
  modelText: string;
  toolCalls: Array<{ name: string; arguments: unknown }>;
  execution: ReturnType<typeof consumeLastScenario1CodeExecution>;
};

async function runCodeModeAttempt(options: {
  model: Model;
  state: {
    load: () => Promise<any>;
    save: (nextState: any) => Promise<void>;
  };
  logger: BenchmarkLogger;
  stage: string;
  userPrompt: string;
  codeModePrompt: string;
}) {
  options.logger.logPrompts(options.stage, {
    systemPrompt: options.codeModePrompt,
    userPrompt: options.userPrompt,
  });

  const modelResult = openrouter.callModel({
    model: options.model,
    input:
      options.stage === "code_mode"
        ? [
            { role: "system", content: options.codeModePrompt },
            { role: "user", content: options.userPrompt },
          ]
        : [{ role: "user", content: options.userPrompt }],
    tools: [executeScenario1Code] as const,
    state: options.state,
    temperature: 0,
    maxOutputTokens: 900,
    stopWhen: stepCountIs(4),
  });

  let modelText = "";
  let responseUsage: Parameters<BenchmarkLogger["addModelResponse"]>[2] = undefined;
  try {
    const response = await withTimeout(
      `${options.stage} response`,
      modelResult.getResponse(),
      modelCallTimeoutMs
    );
    modelText = extractResponseText(response);
    responseUsage = response.usage;
  } catch (error) {
    if (!isInvalidFinalResponseError(error)) throw error;
    options.logger.info(
      "code_mode_response_empty",
      `Model response had empty final output for ${options.stage}; continuing with tool execution output`,
      {
        error: error instanceof Error ? error.message : String(error),
      }
    );
  }
  options.logger.addModelResponse(options.stage, modelText, responseUsage);
  options.logger.info("model_result_text", `Model final message (${options.stage})`, {
    message:
      modelText.length > 0
        ? modelText
        : "(empty final message; see tool result below)",
  });

  const toolCallsRaw = await withTimeout(
    `${options.stage} tool calls`,
    modelResult.getToolCalls(),
    modelCallTimeoutMs
  );

  const toolCalls = normalizeToolCalls(
    toolCallsRaw.map((call) => ({ name: call.name, arguments: call.arguments }))
  );
  options.logger.addToolCalls(options.stage, toolCalls);

  return {
    modelText,
    toolCalls,
    execution: consumeLastScenario1CodeExecution(),
  } satisfies AttemptResult;
}

export async function runCodeModeBenchmark(model: Model = defaultScenario1Model) {
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
    logger.logExpectedResult(expected as unknown as Record<string, unknown>);
    logger.info("expected_result", "Computed scenario expected result from DB seed", {
      topCustomerId: expected.topCustomerId,
      transactionCount: expected.transactionCount,
      averageSpend: expected.averageSpend,
    });

    const codeModePrompt = PROMPTS.scenario1CodeModeSystem;

    const allToolCalls: Array<{ name: string; arguments: unknown }> = [];
    let finalResultFromTool: Record<string, unknown> | null = null;
    let latestTextForEvaluation = "";

    const prompts = [
      PROMPTS.scenario1,
      "Retry now and fix the TypeScript syntax. Call execute_scenario1_code again and return one short confirmation sentence.",
      "Retry again. Keep the code minimal and syntactically valid. Call execute_scenario1_code.",
    ];

    for (let attemptIndex = 0; attemptIndex < prompts.length; attemptIndex += 1) {
      const stage = attemptIndex === 0 ? "code_mode" : `code_mode_retry_${attemptIndex}`;

      const attempt = await runCodeModeAttempt({
        model,
        state: stateAccessor,
        logger,
        stage,
        userPrompt: prompts[attemptIndex] ?? PROMPTS.scenario1,
        codeModePrompt,
      });

      allToolCalls.push(...attempt.toolCalls);
      latestTextForEvaluation = attempt.modelText || latestTextForEvaluation;

      if (attempt.execution?.ok && attempt.execution.result) {
        finalResultFromTool = attempt.execution.result as unknown as Record<string, unknown>;
        const expectedToolName = "execute_scenario1_code";
        if (!allToolCalls.some((call) => call.name === expectedToolName)) {
          const syntheticCall = {
            name: expectedToolName,
            arguments: { synthetic: true, source: "tool_result_event" },
          };
          allToolCalls.push(syntheticCall);
          logger.addToolCalls(stage, [syntheticCall]);
        }
        logger.info("tool_result", "Code execution result from tool", {
          ...attempt.execution.result,
        });
        break;
      }

      logger.info("tool_result", "Code execution failed inside tool", {
        error: attempt.execution?.error ?? "(no execution output captured)",
        stdout: attempt.execution?.stdout?.join(" | ") ?? "",
      });
    }

    logger.info("tool_activity", "Tool calls captured", {
      count: allToolCalls.length,
      names:
        allToolCalls.length > 0
          ? allToolCalls.map((call) => call.name).join(", ")
          : "(none)",
    });

    const finalAnswerText = hasValidResultShape(finalResultFromTool)
      ? JSON.stringify(finalResultFromTool)
      : latestTextForEvaluation;

    const evaluation = evaluateScenario1Run({
      mode: "code-mode",
      calledToolNames: allToolCalls.map((call) => call.name),
      finalText: finalAnswerText,
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
}

if (import.meta.main) {
  await runCodeModeBenchmark();
}
