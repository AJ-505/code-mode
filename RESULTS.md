# Benchmark Results: Regular vs Code Mode

All metrics below use the **best-case representative run per (model, scenario, paradigm)** from `results/`.
When multiple runs exist, representative selection prefers: **pass > benchmark/model failure > non-model failure**, then lower cost, then lower tokens.
Official FX conversion uses the official CBN NFEM weighted average rate as at April-20-2026.

Coverage denominator is always **48 model-scenario cells** (8 models x 6 scenarios) per paradigm.
Recorded Runs can be higher than Coverage because retries and repeated rounds are counted.

| Paradigm | Recorded Runs | Covered Model-Scenario Cells (max 48) | Best Passes | Best Pass Rate | Avg Input Tokens / Best-Case Run | Avg Output Tokens / Best-Case Run | Avg Total Tokens / Best-Case Run | Avg Cost / Best-Case Run (NGN) | Avg API Calls / Best-Case Run | Attempts / Covered Cell | Non-model Fail Best Cases | Benchmark/Model Fail Best Cases | Avg Recovery Cost (NGN) |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 94 | 48/48 [1,2,3,4,5,6] | 24 | 50.0% | 4,680 | 386 | 5,066 | ₦16.83 | 1.96 | 1.96 | 2 | 22 | ₦6.03 |
| Regular (without progressive discovery) | 49 | 48/48 [1,2,3,4,5,6] | 33 | 68.8% | 1,116 | 378 | 1,493 | ₦9.04 | 0.94 | 1.02 | 0 | 15 | n/a |
| Code Mode (progressive API discovery) | 120 | 48/48 [1,2,3,4,5,6] | 29 | 60.4% | 1,290 | 207 | 1,497 | ₦4.98 | 0.96 | 2.50 | 1 | 18 | ₦16.79 |
| Code Mode (full API context) | 92 | 48/48 [1,2,3,4,5,6] | 32 | 66.7% | 2,216 | 382 | 2,597 | ₦10.35 | 1.48 | 1.92 | 3 | 13 | n/a |

## Best Case (Overall)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 46 | 52.2% | 4,864 | 402 | 5,266 | ₦17.53 | 2.00 | 16,975 ms | 0.00 |
| Regular (without progressive discovery) | 48 | 68.8% | 1,116 | 378 | 1,493 | ₦9.04 | 0.94 | 21,303 ms | 0.00 |
| Code Mode (progressive API discovery) | 47 | 61.7% | 1,307 | 193 | 1,500 | ₦4.68 | 0.96 | 20,075 ms | 0.19 |
| Code Mode (full API context) | 45 | 71.1% | 2,209 | 380 | 2,589 | ₦10.81 | 1.49 | 30,309 ms | 0.73 |

## Worst Case (Overall)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 46 | 30.4% | 3,305 | 373 | 3,678 | ₦11.55 | 1.87 | 16,335 ms | 0.00 |
| Regular (without progressive discovery) | 48 | 68.8% | 1,116 | 378 | 1,493 | ₦9.04 | 0.94 | 21,303 ms | 0.00 |
| Code Mode (progressive API discovery) | 47 | 29.8% | 2,712 | 338 | 3,049 | ₦9.23 | 1.70 | 25,227 ms | 1.28 |
| Code Mode (full API context) | 45 | 64.4% | 2,391 | 474 | 2,865 | ₦12.95 | 1.58 | 31,641 ms | 0.89 |

## Average Case (Overall)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 72 | 34.7% | 4,012 | 331 | 4,343 | ₦15.25 | 1.68 | 16,481 ms | 0.00 |
| Regular (without progressive discovery) | 48 | 68.8% | 1,116 | 378 | 1,493 | ₦9.04 | 0.94 | 21,303 ms | 0.00 |
| Code Mode (progressive API discovery) | 96 | 30.2% | 1,814 | 234 | 2,048 | ₦6.17 | 1.21 | 23,674 ms | 0.68 |
| Code Mode (full API context) | 72 | 61.1% | 1,901 | 322 | 2,224 | ₦9.62 | 1.24 | 31,117 ms | 0.60 |

Overall champion (average-case composite): **Regular (without progressive discovery)**

## Recovery Champion (Overall)

Lower is better for retries, cost, and time.

| Paradigm | Recovered Cases | Avg Retries To Recover | Avg Recovery Cost (NGN) | Avg Recovery Time |
|---|---:|---:|---:|---:|
| Regular (with progressive discovery) | 3 | 1.00 | ₦6.03 | 30,019,766 ms |
| Regular (without progressive discovery) | 0 | n/a | n/a | n/a |
| Code Mode (progressive API discovery) | 15 | 1.00 | ₦16.79 | 3,182,640 ms |
| Code Mode (full API context) | 0 | n/a | n/a | n/a |

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

| Model | Regular (with progressive discovery) | Regular (without progressive discovery) | Code Mode (progressive API discovery) | Code Mode (full API context) | Winner |
|---|---|---|---|---|---|
| `anthropic/claude-opus-4.6` | Best 3/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦35.36, Avg Tokens 7,840, Avg API 2.00, Runs 15, Non-model 0, Benchmark/model 3, Recovery n/a | Best 5/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦17.81, Avg Tokens 2,922, Avg API 1.00, Runs 6, Non-model 0, Benchmark/model 1, Recovery n/a | Best 4/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦10.29, Avg Tokens 1,844, Avg API 0.83, Runs 14, Non-model 0, Benchmark/model 2, Recovery ₦22.13 | Best 6/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦11.05, Avg Tokens 2,305, Avg API 1.00, Runs 16, Non-model 0, Benchmark/model 0, Recovery n/a | **Code Mode (Full API Context)** |
| `anthropic/claude-sonnet-4.6` | Best 2/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦38.00, Avg Tokens 8,379, Avg API 2.00, Runs 10, Non-model 0, Benchmark/model 4, Recovery n/a | Best 3/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦18.72, Avg Tokens 2,981, Avg API 1.00, Runs 6, Non-model 0, Benchmark/model 3, Recovery n/a | Best 4/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦12.35, Avg Tokens 1,891, Avg API 0.83, Runs 12, Non-model 0, Benchmark/model 2, Recovery ₦43.44 | Best 5/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦31.99, Avg Tokens 5,640, Avg API 2.00, Runs 9, Non-model 0, Benchmark/model 1, Recovery n/a | **Code Mode (Full API Context)** |
| `google/gemini-3.1-pro-preview` | Best 5/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦38.83, Avg Tokens 7,923, Avg API 2.17, Runs 11, Non-model 0, Benchmark/model 1, Recovery n/a | Best 5/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦27.99, Avg Tokens 2,720, Avg API 1.00, Runs 7, Non-model 0, Benchmark/model 1, Recovery n/a | Best 3/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦7.32, Avg Tokens 891, Avg API 0.83, Runs 14, Non-model 1, Benchmark/model 2, Recovery ₦39.19 | Best 2/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦29.31, Avg Tokens 2,119, Avg API 1.83, Runs 9, Non-model 0, Benchmark/model 4, Recovery n/a | **Regular - Discovery** |
| `google/gemini-3.1-flash-lite-preview` | Best 1/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦1.20, Avg Tokens 2,712, Avg API 2.00, Runs 6, Non-model 0, Benchmark/model 5, Recovery n/a | Best 5/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦0.41, Avg Tokens 486, Avg API 0.83, Runs 6, Non-model 0, Benchmark/model 1, Recovery n/a | Best 2/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦1.54, Avg Tokens 3,359, Avg API 1.83, Runs 21, Non-model 0, Benchmark/model 4, Recovery n/a | Best 1/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦1.60, Avg Tokens 3,336, Avg API 2.00, Runs 6, Non-model 1, Benchmark/model 4, Recovery n/a | **Regular - Discovery** |
| `moonshotai/kimi-k2.5` | Best 2/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦1.07, Avg Tokens 1,212, Avg API 1.67, Runs 25, Non-model 0, Benchmark/model 4, Recovery ₦1.31 | Best 3/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦0.70, Avg Tokens 547, Avg API 0.83, Runs 6, Non-model 0, Benchmark/model 3, Recovery n/a | Best 4/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦0.82, Avg Tokens 1,022, Avg API 0.83, Runs 16, Non-model 0, Benchmark/model 2, Recovery ₦2.99 | Best 5/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦2.04, Avg Tokens 3,151, Avg API 2.00, Runs 20, Non-model 0, Benchmark/model 1, Recovery n/a | **Code Mode (Full API Context)** |
| `openai/gpt-5.4` | Best 5/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦12.70, Avg Tokens 2,787, Avg API 2.00, Runs 14, Non-model 0, Benchmark/model 1, Recovery ₦8.40 | Best 4/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦4.35, Avg Tokens 720, Avg API 1.00, Runs 6, Non-model 0, Benchmark/model 2, Recovery n/a | Best 4/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦5.18, Avg Tokens 981, Avg API 0.83, Runs 13, Non-model 0, Benchmark/model 2, Recovery ₦14.27 | Best 6/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦3.73, Avg Tokens 1,073, Avg API 1.00, Runs 19, Non-model 0, Benchmark/model 0, Recovery n/a | **Code Mode (Full API Context)** |
| `openai/gpt-5.4-mini` | Best 3/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦2.45, Avg Tokens 1,860, Avg API 1.67, Runs 7, Non-model 2, Benchmark/model 1, Recovery n/a | Best 4/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦1.27, Avg Tokens 713, Avg API 1.00, Runs 6, Non-model 0, Benchmark/model 2, Recovery n/a | Best 4/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦1.38, Avg Tokens 851, Avg API 0.83, Runs 17, Non-model 0, Benchmark/model 2, Recovery ₦1.42 | Best 1/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦1.78, Avg Tokens 1,188, Avg API 0.83, Runs 6, Non-model 2, Benchmark/model 3, Recovery n/a | **Regular - Discovery** |
| `z-ai/glm-5.1` | Best 3/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦5.02, Avg Tokens 7,818, Avg API 2.17, Runs 6, Non-model 0, Benchmark/model 3, Recovery n/a | Best 4/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦1.03, Avg Tokens 860, Avg API 0.83, Runs 6, Non-model 0, Benchmark/model 2, Recovery n/a | Best 4/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦0.93, Avg Tokens 1,137, Avg API 0.83, Runs 13, Non-model 0, Benchmark/model 2, Recovery ₦4.10 | Best 6/6, Coverage 6/6 [1,2,3,4,5,6], Avg Cost ₦1.29, Avg Tokens 1,967, Avg API 1.17, Runs 7, Non-model 0, Benchmark/model 0, Recovery n/a | **Code Mode (Full API Context)** |

## Glossary

| Term | Meaning |
|---|---|
| Recorded Runs | Total attempts found in `results/` for that paradigm. |
| Covered Model-Scenario Cells | Unique (model, scenario) pairs with at least one run in that paradigm. Max is 48 because there are 8 models and 6 scenarios. |
| Network Round-Trips | Count of model request/response cycles in a run (derived from `modelResponses`). Lower is better. |
| Network Latency / Round-Trip | End-to-end run duration divided by round-trips, used as proxy latency. Lower is better. |
| Failure-Related Retries | Count of in-run retry loops triggered after tool/code failure feedback. Lower is better. |
| Attempts / Covered Cell | Recorded Runs divided by Covered Cells. This explains rows like 92 runs with 48/48 coverage (many retries per covered cell). |
| Best Passes | Number of covered scenarios where the representative run passed. |
| Non-model Fail Best Cases | Representative runs that failed due to provider, network, timeout, or other infra/runtime issues. |
| Benchmark/Model Fail Best Cases | Representative runs that failed due to evaluation mismatch, missing required tool evidence, or incorrect output content. |
| Avg Recovery Cost | Average spend on failed attempts before a later pass for the same model + scenario + paradigm. |

