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

You can run benchmarks in several ways depending on what you want to test.

### 1) Single scenario via npm script aliases

```bash
bun run benchmark:scenario2:regular
bun run benchmark:scenario2:code-mode
```

Available aliases exist for scenarios `1..6` in both modes.

### 2) Single scenario via generic CLI entrypoint

```bash
bun src/index.ts --scenario=4 --mode=regular
bun src/index.ts --scenario=4 --mode=code-mode
```

Supported values:

- `--scenario=1|2|3|4|5|6`
- `--mode=regular|code-mode`

### 3) Quick default run (scripted in package.json)

```bash
bun run benchmark
```

This currently runs scenario 1 in regular mode.

### 4) Full suite (all scenarios, both modes) via `script.sh`

```bash
./script.sh
```

This runs scenarios `1..6` in this order for each scenario: regular, then code-mode.

### 5) Full suite with model/pricing overrides

```bash
./script.sh --model openai/gpt-5.4 --input 2.5 --output 15
```

Supported flags:

- `--model <model-id>`
- `--input <usd-per-1m-input-tokens>`
- `--output <usd-per-1m-output-tokens>`

Equivalent env var approach:

```bash
MODEL=openai/gpt-5.4 \
INPUT_COST_PER_MILLION_USD=2.5 \
OUTPUT_COST_PER_MILLION_USD=15 \
./script.sh
```

### 6) Helpful examples

```bash
# Run scenario 6 only, code mode
bun src/index.ts --scenario=6 --mode=code-mode

# Run scenario 3 in both modes back-to-back
bun run benchmark:scenario3:regular && bun run benchmark:scenario3:code-mode

# Show script usage/help
./script.sh --help
```

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
