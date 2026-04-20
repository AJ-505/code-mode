# Benchmark Results: Regular vs Code Mode

All metrics below use the **best-case representative run per (model, scenario, paradigm)** from `results/`.
When multiple runs exist, representative selection prefers: **pass > benchmark/model failure > non-model failure**, then lower cost, then lower tokens.
Official FX conversion uses the official CBN NFEM weighted average rate as at April-20-2026.

Coverage denominator is always **48 model-scenario cells** (8 models x 6 scenarios) per paradigm.
Recorded Runs can be higher than Coverage because retries and repeated rounds are counted.

| Paradigm | Recorded Runs | Covered Model-Scenario Cells (max 48) | Best Passes | Best Pass Rate | Avg Input Tokens / Best-Case Run | Avg Output Tokens / Best-Case Run | Avg Total Tokens / Best-Case Run | Avg Cost / Best-Case Run (NGN) | Avg API Calls / Best-Case Run | Attempts / Covered Cell | Non-model Fail Best Cases | Benchmark/Model Fail Best Cases | Avg Recovery Cost (NGN) |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 94 | 48/48 [1,2,3,4,5,6] | 24 | 50.0% | 4,680 | 386 | 5,066 | ₦16.83 | 1.96 | 1.96 | 2 | 22 | ₦6.99 |
| Regular (without progressive discovery) | 49 | 48/48 [1,2,3,4,5,6] | 33 | 68.8% | 1,116 | 378 | 1,493 | ₦9.04 | 0.94 | 1.02 | 0 | 15 | n/a |
| Code Mode | 92 | 48/48 [1,2,3,4,5,6] | 32 | 66.7% | 2,216 | 382 | 2,597 | ₦10.35 | 1.48 | 1.92 | 3 | 13 | n/a |

## Canonical Pricing Used

| Model | Input / 1M Tokens (NGN) | Output / 1M Tokens (NGN) |
|---|---:|---:|
| `anthropic/claude-opus-4.6` | ₦3,374.18 | ₦20,245.11 |
| `anthropic/claude-sonnet-4.6` | ₦3,374.18 | ₦20,245.11 |
| `google/gemini-3.1-pro-preview` | ₦3,374.18 | ₦20,245.11 |
| `google/gemini-3.1-flash-lite-preview` | ₦337.42 | ₦2,024.51 |
| `moonshotai/kimi-k2.5` | ₦516.52 | ₦2,321.44 |
| `openai/gpt-5.4` | ₦3,374.18 | ₦20,245.11 |
| `openai/gpt-5.4-mini` | ₦1,012.26 | ₦6,073.53 |
| `z-ai/glm-5.1` | ₦516.52 | ₦2,321.44 |

## Per-Model Comparison

| Model | Regular (with progressive discovery) | Regular (without progressive discovery) | Code Mode | Winner |
|---|---|---|---|---|
| `anthropic/claude-opus-4.6` | Best 3/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦35.36, Avg Tokens 7,840, Avg API 2.00, Runs 15, Non-model 0, Benchmark/model 3, Recovery n/a | Best 5/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦17.81, Avg Tokens 2,922, Avg API 1.00, Runs 6, Non-model 0, Benchmark/model 1, Recovery n/a | Best 6/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦11.05, Avg Tokens 2,305, Avg API 1.00, Runs 16, Non-model 0, Benchmark/model 0, Recovery n/a | **Code Mode** |
| `anthropic/claude-sonnet-4.6` | Best 2/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦38.00, Avg Tokens 8,379, Avg API 2.00, Runs 10, Non-model 0, Benchmark/model 4, Recovery n/a | Best 3/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦18.72, Avg Tokens 2,981, Avg API 1.00, Runs 6, Non-model 0, Benchmark/model 3, Recovery n/a | Best 5/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦31.99, Avg Tokens 5,640, Avg API 2.00, Runs 9, Non-model 0, Benchmark/model 1, Recovery n/a | **Code Mode** |
| `google/gemini-3.1-pro-preview` | Best 5/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦38.83, Avg Tokens 7,923, Avg API 2.17, Runs 11, Non-model 0, Benchmark/model 1, Recovery ₦5.45 | Best 5/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦27.99, Avg Tokens 2,720, Avg API 1.00, Runs 7, Non-model 0, Benchmark/model 1, Recovery n/a | Best 2/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦29.31, Avg Tokens 2,119, Avg API 1.83, Runs 9, Non-model 0, Benchmark/model 4, Recovery n/a | **Regular - Discovery** |
| `google/gemini-3.1-flash-lite-preview` | Best 1/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦1.20, Avg Tokens 2,712, Avg API 2.00, Runs 6, Non-model 0, Benchmark/model 5, Recovery n/a | Best 5/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦0.41, Avg Tokens 486, Avg API 0.83, Runs 6, Non-model 0, Benchmark/model 1, Recovery n/a | Best 1/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦1.60, Avg Tokens 3,336, Avg API 2.00, Runs 6, Non-model 1, Benchmark/model 4, Recovery n/a | **Regular - Discovery** |
| `moonshotai/kimi-k2.5` | Best 2/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦1.07, Avg Tokens 1,212, Avg API 1.67, Runs 25, Non-model 0, Benchmark/model 4, Recovery ₦1.31 | Best 3/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦0.70, Avg Tokens 547, Avg API 0.83, Runs 6, Non-model 0, Benchmark/model 3, Recovery n/a | Best 5/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦2.04, Avg Tokens 3,151, Avg API 2.00, Runs 20, Non-model 0, Benchmark/model 1, Recovery n/a | **Code Mode** |
| `openai/gpt-5.4` | Best 5/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦12.70, Avg Tokens 2,787, Avg API 2.00, Runs 14, Non-model 0, Benchmark/model 1, Recovery ₦11.38 | Best 4/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦4.35, Avg Tokens 720, Avg API 1.00, Runs 6, Non-model 0, Benchmark/model 2, Recovery n/a | Best 6/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦3.73, Avg Tokens 1,073, Avg API 1.00, Runs 19, Non-model 0, Benchmark/model 0, Recovery n/a | **Code Mode** |
| `openai/gpt-5.4-mini` | Best 3/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦2.45, Avg Tokens 1,860, Avg API 1.67, Runs 7, Non-model 2, Benchmark/model 1, Recovery n/a | Best 4/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦1.27, Avg Tokens 713, Avg API 1.00, Runs 6, Non-model 0, Benchmark/model 2, Recovery n/a | Best 1/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦1.78, Avg Tokens 1,188, Avg API 0.83, Runs 6, Non-model 2, Benchmark/model 3, Recovery n/a | **Regular - Discovery** |
| `z-ai/glm-5.1` | Best 3/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦5.02, Avg Tokens 7,818, Avg API 2.17, Runs 6, Non-model 0, Benchmark/model 3, Recovery n/a | Best 4/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦1.03, Avg Tokens 860, Avg API 0.83, Runs 6, Non-model 0, Benchmark/model 2, Recovery n/a | Best 6/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦1.29, Avg Tokens 1,967, Avg API 1.17, Runs 7, Non-model 0, Benchmark/model 0, Recovery n/a | **Code Mode** |

## Glossary

| Term | Meaning |
|---|---|
| Recorded Runs | Total attempts found in `results/` for that paradigm. |
| Covered Model-Scenario Cells | Unique (model, scenario) pairs with at least one run in that paradigm. Max is 48 because there are 8 models and 6 scenarios. |
| Attempts / Covered Cell | Recorded Runs divided by Covered Cells. This explains rows like 92 runs with 48/48 coverage (many retries per covered cell). |
| Best Passes | Number of covered scenarios where the representative run passed. |
| Non-model Fail Best Cases | Representative runs that failed due to provider, network, timeout, or other infra/runtime issues. |
| Benchmark/Model Fail Best Cases | Representative runs that failed due to evaluation mismatch, missing required tool evidence, or incorrect output content. |
| Avg Recovery Cost | Average spend on failed attempts before a later pass for the same model + scenario + paradigm. |

