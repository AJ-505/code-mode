# Code Mode

This repository benchmarks traditional tool-calling (regular mode) vs code-execution workflows (code-mode) across realistic agent tasks.

## Prerequisites

Install:

1. `bun`
2. `gh` (GitHub CLI)
3. `@googleworkspace/cli`
4. Slack CLI

## Environment

Create `.env` with:

```bash
OPENROUTER_API_KEY=...
DATABASE_URL=postgres://user:password@host:5432/dbname
MODEL=openai/gpt-5.4
BENCHMARK_MODEL_TIMEOUT_MS=240000
INPUT_COST_PER_MILLION_USD=0
OUTPUT_COST_PER_MILLION_USD=0
CACHED_INPUT_COST_PER_MILLION_USD=0
```

## Scenario 1 DB setup

```bash
bun run db:generate
bun run db:push
bun run seed:scenario1
```

## Run benchmarks

### Run a single scenario/mode

```bash
bun run benchmark:scenario2:regular
bun run benchmark:scenario2:code-mode
```

### Run all scenarios via `script.sh`

You can now override model and token pricing from CLI:

```bash
./script.sh --model openai/gpt-5.4 --input 2.5 --output 15
```

Supported flags:

- `--model <model-id>`
- `--input <usd-per-1m-input-tokens>`
- `--output <usd-per-1m-output-tokens>`

This runs scenarios 1-6 in both regular and code-mode.

## Wired scenarios

1. Customer DB average spend
2. Playwright UI audit (target: `https://playwright.dev`)
3. Slack channel summary
4. Drive keyword retrieval
5. Calendar timezone scheduling (simulated)
6. GitHub repo change + PR (simulated)

All run artifacts are written to `results/` as JSON logs plus paired final-comparison files.

## Detailed implementation/process documentation

For a full from-scratch build sequence (including recommended commit slices/messages), see:

- `docs/build-from-scratch.md`
