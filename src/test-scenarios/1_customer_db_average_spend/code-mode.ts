import { createInitialState } from "@openrouter/agent";
import {
	type BenchmarkEvaluationSpec,
	evaluateBenchmarkRun,
	logBenchmarkEvent,
} from "../../lib/benchmark-evaluation.js";
import { type Model, openrouter } from "../../lib/chat-generation.js";
import {
	discoverTools,
	getAllRegisteredProgressiveToolNames,
	getProgressiveToolsByName,
	registerProgressiveTools,
} from "../../lib/progressive-tool-discovery.js";
import { PROMPTS } from "../../lib/prompts.js";
import { benchmark1Tools } from "./tools.js";

const model: Model = "openrouter/free";
const modelCallTimeoutMs = Number(
	process.env.BENCHMARK_MODEL_TIMEOUT_MS ?? 120_000,
);

registerProgressiveTools([...benchmark1Tools]);

const evaluationSpec: BenchmarkEvaluationSpec = {
	benchmarkId: "1_customer_db_average_spend",
	expectedToolGroups: [
		{
			id: "progressive-discovery",
			anyOf: ["discover_tools"],
			required: true,
			note: "Agent should discover hidden tools first.",
		},
		{
			id: "customer-source",
			anyOf: ["get_all_customers", "search_customers_by_name"],
			required: true,
			note: "Agent should query customer data through composable tools.",
		},
		{
			id: "transaction-window",
			anyOf: ["list_transactions_in_window"],
			required: true,
			note: "Agent should retrieve transaction rows within time window.",
		},
		{
			id: "stats",
			anyOf: ["compute_customer_spend_stats"],
			required: true,
			note: "Agent should compute spend stats from composable operation.",
		},
	],
	fuzzyResponseChecks: [
		{
			id: "top-customer-mention",
			terms: ["top customer", "most transactions", "highest transactions"],
			minMatches: 1,
			weight: 1,
		},
		{
			id: "average-spend-mention",
			terms: ["average spend", "avg spend", "mean spend"],
			minMatches: 1,
			weight: 1,
		},
	],
	minNumericMentions: 2,
};

let inMemoryConversationState = createInitialState();

const stateAccessor = {
	load: async () => inMemoryConversationState,
	save: async (nextState: typeof inMemoryConversationState) => {
		inMemoryConversationState = nextState;
	},
};

async function withTimeout<T>(
	stage: string,
	operation: Promise<T>,
	timeoutMs: number,
) {
	let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

	const timeoutPromise = new Promise<never>((_, reject) => {
		timeoutHandle = setTimeout(() => {
			reject(
				new Error(`Timeout while waiting for ${stage} after ${timeoutMs}ms`),
			);
		}, timeoutMs);
	});

	try {
		return await Promise.race([operation, timeoutPromise]);
	} finally {
		if (timeoutHandle) clearTimeout(timeoutHandle);
	}
}

logBenchmarkEvent("benchmark_run_started", {
	benchmarkId: evaluationSpec.benchmarkId,
	model,
	modelCallTimeoutMs,
});

try {
	logBenchmarkEvent("discovery_stage_started", {
		benchmarkId: evaluationSpec.benchmarkId,
		model,
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

	await withTimeout(
		"discovery response",
		discoveryResult.getResponse(),
		modelCallTimeoutMs,
	);
	logBenchmarkEvent("discovery_stage_response_received", {
		benchmarkId: evaluationSpec.benchmarkId,
	});

	const discoveryCalls = await withTimeout(
		"discovery tool calls",
		discoveryResult.getToolCalls(),
		modelCallTimeoutMs,
	);
	const discoveredNames = discoveryCalls
		.filter((call) => call.name === "discover_tools")
		.flatMap((call) => {
			const args = call.arguments;
			if (typeof args !== "object" || args === null || !("toolNames" in args)) {
				return [];
			}

			const maybeToolNames = (args as { toolNames?: unknown }).toolNames;
			return Array.isArray(maybeToolNames) ?
				maybeToolNames.filter(
					(name): name is string => typeof name === "string",
				) :
				[];
		});

	const uniqueDiscovered = [...new Set(discoveredNames)];
	const unlocked = getProgressiveToolsByName(uniqueDiscovered);

	logBenchmarkEvent("discovery_stage_tools_unlocked", {
		benchmarkId: evaluationSpec.benchmarkId,
		discoveryCallCount: discoveryCalls.length,
		discoveredToolNames: uniqueDiscovered,
		unlockedCount: unlocked.length,
	});

	const toolsForExecution = unlocked.length > 0 ?
		[discoverTools, ...unlocked] :
		[
			discoverTools,
			...getProgressiveToolsByName(getAllRegisteredProgressiveToolNames()),
		];

	logBenchmarkEvent("execution_stage_started", {
		benchmarkId: evaluationSpec.benchmarkId,
		availableToolCount: toolsForExecution.length,
		availableToolNames: toolsForExecution
			.filter((tool) => tool.type === "function")
			.map((tool) => tool.function.name),
	});

	const executionResult = openrouter.callModel({
		model,
		input: [
			{
				role: "user",
				content:
					"Continue from the previous step. Use the unlocked tool(s), compute the answer, and return a concise result.",
			},
		],
		tools: toolsForExecution,
		state: stateAccessor,
	});

	const finalText = await withTimeout(
		"execution text",
		executionResult.getText(),
		modelCallTimeoutMs,
	);
	const executionCalls = await withTimeout(
		"execution tool calls",
		executionResult.getToolCalls(),
		modelCallTimeoutMs,
	);

	logBenchmarkEvent("execution_stage_completed", {
		benchmarkId: evaluationSpec.benchmarkId,
		executionCallCount: executionCalls.length,
		executionToolNames: executionCalls.map((call) => call.name),
		finalTextLength: finalText.length,
	});

	const calledToolNames = [
		...discoveryCalls.map((call) => call.name),
		...executionCalls.map((call) => call.name),
	];

	const evaluation = evaluateBenchmarkRun({
		calledToolNames,
		finalText,
		spec: evaluationSpec,
	});

	logBenchmarkEvent("benchmark_run_summary", {
		benchmarkId: evaluationSpec.benchmarkId,
		overallPass: evaluation.overallPass,
		calledToolNames: evaluation.toolEval.calledToolNames,
		toolEval: evaluation.toolEval,
		fuzzyEval: evaluation.fuzzyEval,
		numericMentions: evaluation.numericMentions,
	});

	console.log(finalText);
	console.log(JSON.stringify(evaluation, null, 2));
} catch (error) {
	logBenchmarkEvent("benchmark_run_failed", {
		benchmarkId: evaluationSpec.benchmarkId,
		error: error instanceof Error ? error.message : String(error),
	});

	throw error;
}
