# Benchmark Results: Regular vs Code Mode

Using the **latest run per (model, scenario, mode)** from `results/` (72 runs total).
Costs are **recomputed from tokens using canonical per-model pricing** to avoid mixed-price rerun distortion.
Failures are split into **non-model** (provider/API or infra/runtime) vs **benchmark/model** failures.

| Paradigm | Input Tokens | Output Tokens | Total Tokens | Recomputed Price (USD) | Tests Right | Tests Wrong | Non-model Fails | Benchmark/Model Fails | Pass Rate |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular | 193,354 | 17,240 | 210,594 | $0.563066 | 17 | 19 | 1 | 18 | 47.2% |
| Code Mode | 85,614 | 19,578 | 105,192 | $0.408644 | 27 | 9 | 2 | 7 | 75.0% |

| Savings vs Regular (Code Mode) | Value |
|---|---:|
| Input token savings | **55.7%** fewer |
| Output token savings | **-13.6%** (higher output) |
| Total token savings | **50.0%** fewer |
| Recomputed price savings | **27.4%** cheaper |

## Canonical pricing used

| Model | Input $/1M | Output $/1M | Cached input $/1M |
|---|---:|---:|---:|
| `anthropic/claude-opus-4.6` | 2.5 | 15 | 0 |
| `anthropic/claude-sonnet-4.6` | 2.5 | 15 | 0 |
| `google/gemini-3.1-pro-preview` | 2.5 | 15 | 0 |
| `moonshotai/kimi-k2.5` | 0.3827 | 1.72 | 0 |
| `openai/gpt-5.4` | 2.5 | 15 | 0 |
| `z-ai/glm-5.1` | 0.3827 | 1.72 | 0 |

## Per-Model Comparison

| Model | Regular (In/Out, Recomputed Price, R/W, NM fails) | Code Mode (In/Out, Recomputed Price, R/W, NM fails) | Winner |
|---|---|---|---|
| `anthropic/claude-opus-4.6` | 43,851 / 3,015, $0.154852, 1 / 5, NM=0 | 13,101 / 1,914, $0.061462, 6 / 0, NM=0 | **Code Mode** |
| `anthropic/claude-sonnet-4.6` | 46,816 / 3,458, $0.168910, 2 / 4, NM=0 | 29,227 / 4,610, $0.142217, 5 / 1, NM=0 | **Code Mode** |
| `google/gemini-3.1-pro-preview` | 43,237 / 4,302, $0.172623, 5 / 1, NM=0 | 5,703 / 10,468, $0.171277, 2 / 4, NM=0 | **Regular** |
| `moonshotai/kimi-k2.5` | 7,506 / 2,055, $0.006407, 2 / 4, NM=1 | 19,891 / 1,653, $0.010455, 2 / 4, NM=2 | **Tie** |
| `openai/gpt-5.4` | 8,302 / 1,147, $0.037960, 4 / 2, NM=0 | 6,784 / 37, $0.017515, 6 / 0, NM=0 | **Code Mode** |
| `z-ai/glm-5.1` | 43,642 / 3,263, $0.022314, 3 / 3, NM=0 | 10,908 / 896, $0.005716, 6 / 0, NM=0 | **Code Mode** |
