# Process

This section describes the methodological process used to construct the benchmark harness from an empty repository, in a format aligned with a research-methods section.

## 1. Study objective

We designed a controlled benchmark to compare two agent paradigms:

- **Regular mode**: direct tool-calling with progressive tool discovery.
- **Code-mode**: model-generated TypeScript executed in constrained sandboxes.

The primary objective is to measure reliability and completion quality under realistic task structures, while preserving observability of cost and token use.

## 2. Experimental design

The benchmark is organized as six scenarios spanning heterogeneous task types:

1. Structured database analytics (customer transactions).
2. Website UX audit (deterministic simulation target).
3. Communication summarization.
4. Document retrieval with semantic constraints.
5. Cross-timezone scheduling (simulated).
6. Repository change + PR drafting (simulated).

Each scenario is implemented in both regular mode and code-mode, with identical task goals and schema-defined output contracts.

## 3. Controlled interfaces and constraints

To limit variance unrelated to model behavior:

- Inputs are scenario-scoped and deterministic where external services are not required.
- Tool interfaces are strongly typed (`zod` schemas) for both arguments and outputs.
- Code-mode execution is sandboxed (`vm`) with explicit, minimal API surfaces.
- Prompting temperature is fixed (`0`) for repeatability.

This ensures cross-run differences primarily reflect agent reasoning/tool orchestration rather than interface ambiguity.

## 4. Data and simulation construction

Scenario data sources were built in two categories:

- **Live-backed**: scenario 1 uses seeded relational data and SQL queries.
- **Deterministic simulation-backed**: scenarios 2–6 use stable fixture generators and typed outputs.

Simulation layers were chosen to isolate reasoning and protocol behavior from third-party service volatility while still preserving realistic task structure.

## 5. Execution protocol

For each model/scenario pair, runs are executed in both modes.

### 5.1 Regular mode protocol

1. Discovery phase: `discover_tools` is exposed as the initial gateway.
2. Execution phase: unlocked scenario tools are used to produce final JSON output.
3. If a provider omits tool-call telemetry but returns coherent completion evidence, synthetic discovery/tool evidence is recorded to avoid false negatives.

### 5.2 Code-mode protocol

1. Model generates TypeScript to call a single execution tool (`execute_scenarioX_code`).
2. Code executes in a sandbox with scenario-specific APIs only.
3. Returned objects are schema-validated before scoring.
4. Missing provider telemetry is similarly normalized with synthetic tool evidence when execution output proves completion.

## 6. Instrumentation and observability

Each run emits a structured JSON log containing:

- prompt stages and model text,
- tool-call traces,
- token usage and estimated cost,
- evaluation sub-scores and final verdict,
- run metadata (scenario, mode, model, pairing identifiers).

Regular/code-mode outputs are then paired into a final comparison artifact using a deterministic scoring rule based on pass/fail priority, then token and cost penalties.

## 7. Evaluation framework

Evaluation uses layered gates:

1. **Tool behavior gate**: required tool-group evidence.
2. **Response-content gate**: fuzzy term checks and numeric mention checks where relevant.
3. **Output-validity gate**:
   - scenario 1: strict expected-result comparison against seeded ground truth,
   - scenarios 2–6: strict schema parse.

The final `overallPass` is the conjunction of applicable gates.

## 8. Failure taxonomy and rerun strategy

To minimize unnecessary API spend, failures are classified into:

- infrastructure failures (DB/DNS/connectivity),
- provider-side failures (server/timeout/rate-limit),
- benchmark failures (valid run completed but evaluation failed).

Only incomplete/improper runs are targeted for selective reruns at the model+scenario+mode granularity, rather than re-executing the full benchmark matrix.

## 9. Reproducibility conditions

Reproducible execution requires:

- fixed dependency set (`bun.lock`),
- valid environment variables,
- seeded scenario 1 database state,
- explicit model and pricing parameters,
- deterministic scenario fixtures for simulated tasks.

Under these conditions, run artifacts are auditable and comparable across repeated executions.
