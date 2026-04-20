# Benchmark Process

This document records how each benchmark scenario was constructed from the source files in `src/`.

## Common Harness Pattern

### Initial system prompts

- Regular mode starts from `PROMPTS.systemPrompt` in `src/lib/prompts.ts`:
  - use progressive discovery when tools are hidden
  - call `discover_tools` with exact tool names when needed
- Code mode reuses that base prompt and adds a scenario-specific code-mode system prompt:
  - only one executor tool is exposed, `execute_scenarioX_code`
  - the model must send a full TypeScript program in `typescript`
  - the program must use the scenario sandbox API only
  - the final assistant message must be one short completion sentence
  - the program must return a strict JSON object with the scenario contract

### Tool definition pattern

- Regular mode tools are plain `@openrouter/agent` tools with `zod` input and output schemas.
- Code mode tools are sandbox executors built with:
  - `vm` to isolate model-written code
  - a narrow scenario-specific `api` object
  - `zod` parsing of the returned object
  - stdout capture and last-execution snapshots for observability
- Scenario 1 regular mode is special:
  - it exposes a live DB-backed toolset after discovery
  - it also computes a seeded ground truth result from the database
- Scenarios 2 to 6 regular mode expose one deterministic simulation tool after discovery.

### Evaluation pattern

- Common evaluation plumbing lives in `src/lib/benchmark-evaluation.ts`.
- Every scenario checks:
  - expected tool-group evidence
  - fuzzy response-field evidence
  - schema or expected-result validation
- Scenario 1 uses strict expected-result comparison against the seeded database.
- Scenarios 2 to 6 now use:
  - schema validation
  - deterministic expected-result checks against scenario fixture data
  - normalization for known valid output variants, such as nested fields

### Seed and fixture pattern

- Scenario 1 uses relational seed data populated by `seed-scripts/scenario1-seed.ts`.
- Scenarios 2 to 6 use deterministic fixture generators in each scenario `data.ts`.

## Scenario 1: Customer DB Average Spend

### Initial prompts

- User task in `PROMPTS.scenario1`:
  - find the customer with the most transactions in the past week and their average spend
- Code-mode system prompt in `PROMPTS.scenario1CodeModeSystem`:
  - only `execute_scenario1_code`
  - return `{ topCustomerId, topCustomerName, transactionCount, totalSpend, averageSpend, fromIso, toIso }`

### Tool definitions

- Regular mode tools in `src/test-scenarios/1_customer_db_average_spend/tools.ts`:
  - `get_current_datetime`
  - `get_all_customers`
  - `search_customers_by_name`
  - `list_transactions_in_window`
  - `compute_customer_spend_stats`
- Code-mode executor in `src/test-scenarios/1_customer_db_average_spend/code-mode-tools.ts` exposes:
  - `api.getCurrentDatetime()`
  - `api.getAllCustomers()`
  - `api.searchCustomersByName()`
  - `api.listTransactionsInWindow()`
  - `api.computeCustomerSpendStats()`
  - `api.solveScenario1()` as a baseline helper

### Evaluation criteria

- File: `src/test-scenarios/1_customer_db_average_spend/evaluation.ts`
- Regular mode must show discovery plus composable DB/tool usage.
- Code mode must call `execute_scenario1_code`.
- Final output is parsed as JSON and compared against seeded truth:
  - top customer id or name
  - transaction count
  - total spend
  - average spend

### Seed data generation

- File: `src/test-scenarios/1_customer_db_average_spend/data.ts`
- Reads from the seeded Postgres tables in `src/db/schema.ts`.
- `computeScenario1ExpectedResult()` scans the last 7-day transaction window and derives the ground truth.

## Scenario 2: Playwright UI Audit

### Initial prompts

- User task in `PROMPTS.scenario2`:
  - audit a demo site for UI and UX issues
  - return severity, repro steps, and suggested fixes
- Code-mode system prompt in `PROMPTS.scenario2CodeModeSystem`:
  - return `{ siteUrl, findings, summary }`

### Tool definitions

- Regular mode tool in `src/test-scenarios/2_playwright_ui_audit/tools.ts`:
  - `audit_demo_site`
- Code-mode executor in `src/test-scenarios/2_playwright_ui_audit/code-mode-tools.ts` exposes:
  - `api.getTargetSite()`
  - `api.auditSite()`

### Evaluation criteria

- File: `src/test-scenarios/2_playwright_ui_audit/evaluation.ts`
- Requires discovery in regular mode and executor usage in code mode.
- Parses the result against `scenario2ResultSchema`.
- Deterministic correctness now also requires:
  - `siteUrl === https://playwright.dev`
  - one medium hierarchy finding
  - one low focus/accessibility finding
  - a summary mentioning hierarchy plus accessibility/focus

### Seed data generation

- File: `src/test-scenarios/2_playwright_ui_audit/data.ts`
- Fixture is static:
  - two findings
  - one summary
  - default site URL `https://playwright.dev`

## Scenario 3: Slack Summary

### Initial prompts

- User task in `PROMPTS.scenario3`:
  - summarize the last 24 hours of a Slack channel
  - include topics, decisions, blockers, and action items
- Code-mode system prompt in `PROMPTS.scenario3CodeModeSystem`:
  - return `{ channelId, fromIso, toIso, summary, topics, actionItems }`

### Tool definitions

- Regular mode tool in `src/test-scenarios/3_slack_summary/tools.ts`:
  - `summarize_slack_channel`
- Code-mode executor in `src/test-scenarios/3_slack_summary/code-mode-tools.ts` exposes:
  - `api.getTargetChannel()`
  - `api.summarizeChannel()`

### Evaluation criteria

- File: `src/test-scenarios/3_slack_summary/evaluation.ts`
- Normalizes valid variants:
  - `timeWindow.fromIso` or `timeWindow.from`
  - `timeWindow.toIso` or `timeWindow.to`
  - `majorTopics` mapped into `topics`
- Deterministic correctness now requires:
  - expected channel id
  - release + analytics + ownership summary content
  - at least two expected topics
  - action items for Avery and Jordan with the expected tasks

### Seed data generation

- File: `src/test-scenarios/3_slack_summary/data.ts`
- Fixture is generated from `new Date()`:
  - channel `C123BENCH`
  - rolling 24-hour window
  - fixed summary, topics, and action items

## Scenario 4: Drive Keyword Retrieval

### Initial prompts

- User task in `PROMPTS.scenario4`:
  - find a keyword said by a speaker on a given day in meeting notes
  - return exact excerpts and source metadata
- Code-mode system prompt in `PROMPTS.scenario4CodeModeSystem`:
  - return `{ query, speaker, date, matches }`

### Tool definitions

- Regular mode tool in `src/test-scenarios/4_drive_keyword_retrieval/tools.ts`:
  - `retrieve_drive_keyword`
- Code-mode executor in `src/test-scenarios/4_drive_keyword_retrieval/code-mode-tools.ts` exposes:
  - `api.getDefaultQuery()`
  - `api.retrieveKeyword()`

### Evaluation criteria

- File: `src/test-scenarios/4_drive_keyword_retrieval/evaluation.ts`
- Parses the result against `scenario4ResultSchema`.
- Deterministic correctness now requires:
  - exact default query, speaker, and date
  - both expected file IDs
  - excerpts matching the seeded fixture content

### Seed data generation

- File: `src/test-scenarios/4_drive_keyword_retrieval/data.ts`
- Fixture is static:
  - query `rollback`
  - speaker `Avery`
  - date `2026-04-10`
  - two deterministic drive matches

## Scenario 5: Calendar Timezone Scheduling

### Initial prompts

- User task in `PROMPTS.scenario5`:
  - propose a hypothetical meeting time with someone in Bolivia
  - respect time zones, working hours, and conflicts
- Code-mode system prompt in `PROMPTS.scenario5CodeModeSystem`:
  - return `{ proposedStartIso, proposedEndIso, localTimezone, boliviaTimezone, rationale }`

### Tool definitions

- Regular mode tool in `src/test-scenarios/5_calendar_timezone_scheduling/tools.ts`:
  - `propose_cross_timezone_slot`
- Code-mode executor in `src/test-scenarios/5_calendar_timezone_scheduling/code-mode-tools.ts` exposes:
  - `api.getSchedulingContext()`
  - `api.proposeMeetingSlot()`

### Evaluation criteria

- File: `src/test-scenarios/5_calendar_timezone_scheduling/evaluation.ts`
- Parses the result against `scenario5ResultSchema`.
- Deterministic correctness now requires:
  - exact seeded start and end ISO times
  - exact LA and Bolivia time zones
  - rationale mentioning working hours and conflict avoidance

### Seed data generation

- File: `src/test-scenarios/5_calendar_timezone_scheduling/data.ts`
- Fixture contains:
  - the expected final slot
  - working-hour windows
  - deterministic local busy slots
  - deterministic Bolivia busy slots

## Scenario 6: GitHub Repo Change + PR

### Initial prompts

- User task in `PROMPTS.scenario6`:
  - fetch a repo, apply a requested change, and create a PR
  - return changed files and PR metadata
- Code-mode system prompt in `PROMPTS.scenario6CodeModeSystem`:
  - return `{ repo, branch, changedFiles, prTitle, prBody, prUrl }`

### Tool definitions

- Regular mode tool in `src/test-scenarios/6_github_repo_change_pr/tools.ts`:
  - `simulate_repo_change_and_pr`
- Code-mode executor in `src/test-scenarios/6_github_repo_change_pr/code-mode-tools.ts` exposes:
  - `api.getRepoTask()`
  - `api.applyRepoChange()`

### Evaluation criteria

- File: `src/test-scenarios/6_github_repo_change_pr/evaluation.ts`
- Normalizes valid nested output variants:
  - root-level PR fields
  - nested `pr.{ repo, branch, title, body, url }`
- Deterministic correctness now requires:
  - expected repo
  - expected branch
  - expected PR title and URL
  - `README.md` in changed files
  - PR body content matching the seeded change summary

### Seed data generation

- File: `src/test-scenarios/6_github_repo_change_pr/data.ts`
- Fixture is static:
  - repo `octo-org/benchmark-demo-repo`
  - branch `benchmark/fix-readme-typo`
  - one changed file, `README.md`
  - deterministic PR title, body, and URL
