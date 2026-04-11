import { createInitialState } from "@openrouter/agent";
import { openrouter, type Model } from "../../lib/chat-generation.js";
import {
  evaluateBenchmarkRun,
  logBenchmarkEvent,
  type BenchmarkEvaluationSpec,
} from "../../lib/benchmark-evaluation.js";
import {
  discoverTools,
  getAllRegisteredProgressiveToolNames,
  getProgressiveToolsByName,
  registerProgressiveTools,
} from "../../lib/progressive-tool-discovery.js";
import { PROMPTS } from "../../lib/prompts.js";
import { benchmark1Tools } from "./tools.js";

const model: Model = "openRouter/free";

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

const discoveryResult = openrouter.callModel({
  model,
  input: [
    { role: "system", content: PROMPTS.systemPrompt },
    { role: "user", content: PROMPTS.scenario1 },
  ],
  tools: [discoverTools] as const,
  state: stateAccessor,
});

await discoveryResult.getResponse();

const discoveryCalls = await discoveryResult.getToolCalls();
const discoveredNames = discoveryCalls
  .filter((call) => call.name === "discover_tools")
  .flatMap((call) => {
    const maybeNames = (call.arguments as { toolNames?: unknown }).toolNames;
    return Array.isArray(maybeNames)
      ? maybeNames.filter((name): name is string => typeof name === "string")
      : [];
  });

const uniqueDiscovered = [...new Set(discoveredNames)];
const unlocked = getProgressiveToolsByName(uniqueDiscovered);

const toolsForExecution =
  unlocked.length > 0
    ? [discoverTools, ...unlocked]
    : [
        discoverTools,
        ...getProgressiveToolsByName(getAllRegisteredProgressiveToolNames()),
      ];

const executionResult = openrouter.callModel({
  model,
  input:
    "Continue from the previous step. Use the unlocked tool(s), compute the answer, and return a concise result.",
  tools: toolsForExecution,
  state: stateAccessor,
});

const finalText = await executionResult.getText();
const executionCalls = await executionResult.getToolCalls();

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
