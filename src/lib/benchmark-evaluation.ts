export type ExpectedToolGroup = {
  id: string;
  anyOf: string[];
  required: boolean;
  note?: string;
};

export type FuzzyResponseCheck = {
  id: string;
  terms: string[];
  minMatches: number;
  weight?: number;
};

export type BenchmarkEvaluationSpec = {
  benchmarkId: string;
  expectedToolGroups: ExpectedToolGroup[];
  fuzzyResponseChecks: FuzzyResponseCheck[];
  minNumericMentions?: number;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeToolName = (value: string) => {
  let normalized = value.replace(/<\|[^|]+\|>\w*/g, "").trim();

  if (normalized.includes("\"name\":\"")) {
    const match = normalized.match(/\"name\":\"([^\"]+)\"/);
    if (match?.[1]) normalized = match[1];
  }

  normalized = normalized.replace(/[\[\]{}"'<>]/g, "").trim();
  return normalized;
};

const countNumericMentions = (value: string) => {
  const matches = value.match(/\b\d+(?:\.\d+)?\b/g);
  return matches ? matches.length : 0;
};

export function evaluateExpectedTools(
  calledToolNames: string[],
  groups: ExpectedToolGroup[]
) {
  const uniqueCalled = [
    ...new Set(calledToolNames.map((name) => normalizeToolName(name))),
  ];

  const details = groups.map((group) => {
    const matched = group.anyOf.filter((name) => uniqueCalled.includes(name));
    return {
      groupId: group.id,
      required: group.required,
      expectedAnyOf: group.anyOf,
      matched,
      pass: matched.length > 0 || !group.required,
      note: group.note,
    };
  });

  return {
    pass: details.every((group) => group.pass),
    details,
    calledToolNames: uniqueCalled,
  };
}

export function evaluateFuzzyResponse(
  text: string,
  checks: FuzzyResponseCheck[]
) {
  const normalizedText = normalize(text);

  const details = checks.map((check) => {
    const matchedTerms = check.terms.filter((term) =>
      normalizedText.includes(normalize(term))
    );

    const weight = check.weight ?? 1;

    return {
      checkId: check.id,
      requiredMinMatches: check.minMatches,
      matchedCount: matchedTerms.length,
      matchedTerms,
      pass: matchedTerms.length >= check.minMatches,
      weight,
    };
  });

  const scoredWeight = details
    .filter((item) => item.pass)
    .reduce((sum, item) => sum + item.weight, 0);
  const totalWeight = details.reduce((sum, item) => sum + item.weight, 0);

  return {
    pass: details.every((item) => item.pass),
    score: totalWeight === 0 ? 1 : scoredWeight / totalWeight,
    details,
  };
}

export function evaluateBenchmarkRun({
  calledToolNames,
  finalText,
  spec,
}: {
  calledToolNames: string[];
  finalText: string;
  spec: BenchmarkEvaluationSpec;
}) {
  const toolEval = evaluateExpectedTools(
    calledToolNames,
    spec.expectedToolGroups
  );
  const fuzzyEval = evaluateFuzzyResponse(finalText, spec.fuzzyResponseChecks);
  const numericMentions = countNumericMentions(finalText);
  const numericGatePass =
    spec.minNumericMentions === undefined
      ? true
      : numericMentions >= spec.minNumericMentions;

  return {
    benchmarkId: spec.benchmarkId,
    overallPass: toolEval.pass && fuzzyEval.pass && numericGatePass,
    toolEval,
    fuzzyEval,
    numericMentions,
    numericGatePass,
  };
}

export function logBenchmarkEvent(
  event: string,
  data: Record<string, unknown>
) {
  console.log(
    JSON.stringify({
      ...data,
      channel: "benchmark-observability",
      event,
      ts: new Date().toISOString(),
    })
  );
}
