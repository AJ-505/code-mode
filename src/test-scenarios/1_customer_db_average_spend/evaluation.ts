import { evaluateBenchmarkRun, type BenchmarkEvaluationSpec } from "../../lib/benchmark-evaluation.js";
import type { Scenario1ExpectedResult } from "./data.js";

export const scenario1EvaluationSpec: BenchmarkEvaluationSpec = {
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
      terms: [
        "top customer",
        "most transactions",
        "highest transactions",
        "topCustomerId",
        "topCustomerName",
      ],
      minMatches: 1,
      weight: 1,
    },
    {
      id: "average-spend-mention",
      terms: ["average spend", "avg spend", "mean spend", "averageSpend"],
      minMatches: 1,
      weight: 1,
    },
  ],
  minNumericMentions: 2,
};

export const scenario1CodeModeEvaluationSpec: BenchmarkEvaluationSpec = {
  ...scenario1EvaluationSpec,
  expectedToolGroups: [
    {
      id: "code-execution",
      anyOf: ["execute_scenario1_code"],
      required: true,
      note: "Code mode must write and execute code.",
    },
  ],
  fuzzyResponseChecks: [
    {
      id: "top-customer-json-key",
      terms: ["topCustomerId", "topCustomerName"],
      minMatches: 1,
      weight: 1,
    },
    {
      id: "average-spend-json-key",
      terms: ["averageSpend"],
      minMatches: 1,
      weight: 1,
    },
  ],
  minNumericMentions: 0,
};

type ParsedScenario1Answer = {
  topCustomerId?: string;
  topCustomerName?: string;
  transactionCount?: number;
  averageSpend?: number;
  totalSpend?: number;
  fromIso?: string;
  toIso?: string;
};

export function extractJsonObject(text: string): Record<string, unknown> | null {
  const trimmed = text.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      return JSON.parse(trimmed) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  const blockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (blockMatch?.[1]) {
    const candidate = blockMatch[1].trim();
    if (candidate.startsWith("{") && candidate.endsWith("}")) {
      try {
        return JSON.parse(candidate) as Record<string, unknown>;
      } catch {
        return null;
      }
    }
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    const candidate = text.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  return null;
}

function toParsedAnswer(value: Record<string, unknown> | null): ParsedScenario1Answer {
  if (!value) return {};

  const parsed: ParsedScenario1Answer = {};

  if (typeof value.topCustomerId === "string") {
    parsed.topCustomerId = value.topCustomerId;
  }

  if (typeof value.topCustomerName === "string") {
    parsed.topCustomerName = value.topCustomerName;
  }

  if (typeof value.transactionCount === "number") {
    parsed.transactionCount = value.transactionCount;
  }

  if (typeof value.averageSpend === "number") {
    parsed.averageSpend = value.averageSpend;
  }

  if (typeof value.totalSpend === "number") {
    parsed.totalSpend = value.totalSpend;
  }

  if (typeof value.fromIso === "string") {
    parsed.fromIso = value.fromIso;
  }

  if (typeof value.toIso === "string") {
    parsed.toIso = value.toIso;
  }

  return parsed;
}

export function evaluateAgainstExpectedResult(options: {
  finalText: string;
  expected: Scenario1ExpectedResult;
}) {
  const parsedRaw = extractJsonObject(options.finalText);
  const parsed = toParsedAnswer(parsedRaw);

  const topCustomerPass =
    parsed.topCustomerId === options.expected.topCustomerId ||
    parsed.topCustomerName === options.expected.topCustomerName;

  const transactionCountPass =
    typeof parsed.transactionCount === "number" &&
    parsed.transactionCount === options.expected.transactionCount;

  const averageSpendPass =
    typeof parsed.averageSpend === "number" &&
    Math.abs(parsed.averageSpend - options.expected.averageSpend) <= 0.01;

  const totalSpendPass =
    typeof parsed.totalSpend === "number" &&
    Math.abs(parsed.totalSpend - options.expected.totalSpend) <= 0.01;

  return {
    pass: topCustomerPass && transactionCountPass && averageSpendPass && totalSpendPass,
    parsed,
    details: {
      topCustomerPass,
      transactionCountPass,
      averageSpendPass,
      totalSpendPass,
      expected: options.expected,
    },
  };
}

export function evaluateScenario1Run(options: {
  calledToolNames: string[];
  finalText: string;
  expected: Scenario1ExpectedResult;
  mode: "regular" | "code-mode";
}) {
  const spec =
    options.mode === "code-mode"
      ? scenario1CodeModeEvaluationSpec
      : scenario1EvaluationSpec;

  const base = evaluateBenchmarkRun({
    calledToolNames: options.calledToolNames,
    finalText: options.finalText,
    spec,
  });

  const expectedEval = evaluateAgainstExpectedResult({
    finalText: options.finalText,
    expected: options.expected,
  });

  return {
    ...base,
    expectedEval,
    overallPass: base.overallPass && expectedEval.pass,
  };
}
