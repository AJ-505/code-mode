# anthropic/claude-opus-4.6

Official FX conversion in this report uses the official CBN NFEM weighted average rate as at April-20-2026.

## Summary

| Paradigm | Best Passes | Covered Scenarios (max 6) | Best Pass Rate | Recorded Runs | Avg Input Tokens / Run | Avg Output Tokens / Run | Avg Total Tokens / Run | Avg Cost / Run (NGN) | Avg API Calls / Run | Attempts / Covered Scenario | Non-model Fail Runs | Benchmark/Model Fail Runs | Avg Recovery Cost (NGN) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 3/6 | 6/6 | 50.0% | 15 | 7,312 | 528 | 7,840 | ₦35.36 | 2.00 | 2.50 | 0 | 3 | n/a |
| Regular (without progressive discovery) | 5/6 | 6/6 | 83.3% | 6 | 2,451 | 472 | 2,922 | ₦17.81 | 1.00 | 1.00 | 0 | 1 | n/a |
| Code Mode (progressive API discovery) | 4/6 | 6/6 | 66.7% | 14 | 1,604 | 241 | 1,844 | ₦10.29 | 0.83 | 2.33 | 0 | 2 | ₦22.13 |
| Code Mode (full API context) | 6/6 | 6/6 | 100.0% | 16 | 2,111 | 194 | 2,305 | ₦11.05 | 1.00 | 2.67 | 0 | 0 | n/a |

## Best Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 6 | 50.0% | 7,312 | 528 | 7,840 | ₦35.36 | 2.00 | 18,120 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 83.3% | 2,451 | 472 | 2,922 | ₦17.81 | 1.00 | 18,143 ms | 0.00 |
| Code Mode (progressive API discovery) | 6 | 66.7% | 1,604 | 241 | 1,844 | ₦10.29 | 0.83 | 15,745 ms | 0.00 |
| Code Mode (full API context) | 6 | 100.0% | 2,111 | 194 | 2,305 | ₦11.05 | 1.00 | 21,328 ms | 0.00 |

## Worst Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 6 | 16.7% | 8,815 | 535 | 9,349 | ₦40.57 | 2.17 | 14,759 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 83.3% | 2,451 | 472 | 2,922 | ₦17.81 | 1.00 | 18,143 ms | 0.00 |
| Code Mode (progressive API discovery) | 6 | 50.0% | 2,618 | 291 | 2,909 | ₦14.73 | 1.17 | 18,051 ms | 0.33 |
| Code Mode (full API context) | 6 | 100.0% | 2,764 | 389 | 3,153 | ₦17.20 | 1.17 | 38,892 ms | 0.17 |

## Average Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 13 | 30.8% | 7,633 | 506 | 8,139 | ₦36.00 | 2.08 | 15,601 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 83.3% | 2,451 | 472 | 2,922 | ₦17.81 | 1.00 | 18,143 ms | 0.00 |
| Code Mode (progressive API discovery) | 12 | 33.3% | 1,752 | 199 | 1,951 | ₦9.95 | 0.83 | 16,170 ms | 0.17 |
| Code Mode (full API context) | 13 | 100.0% | 2,482 | 295 | 2,777 | ₦14.34 | 1.08 | 30,199 ms | 0.08 |

## Recovery Benchmarks

Lower is better for retries, cost, and time.

| Paradigm | Recovered Cases | Avg Retries To Recover | Avg Recovery Cost (NGN) | Avg Recovery Time |
|---|---:|---:|---:|---:|
| Regular (with progressive discovery) | 0 | n/a | n/a | n/a |
| Regular (without progressive discovery) | 0 | n/a | n/a | n/a |
| Code Mode (progressive API discovery) | 1 | 1.00 | ₦22.13 | 4,500,757 ms |
| Code Mode (full API context) | 0 | n/a | n/a | n/a |

## Failure Analysis (All Recorded Rounds)

Total rounds: **62**
Failed rounds: **36**

| Paradigm | Recorded Rounds | Failed Rounds | Failure Rate | Non-model Failures | Benchmark/Model Failures |
|---|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 15 | 11 | 73.3% | 2 | 9 |
| Regular (without progressive discovery) | 6 | 1 | 16.7% | 0 | 1 |
| Code Mode (progressive API discovery) | 25 | 21 | 84.0% | 2 | 19 |
| Code Mode (full API context) | 16 | 3 | 18.8% | 3 | 0 |

| Failure Reason | Count | Scenarios | Paradigms | Human-readable reason | Latest Example File |
|---|---:|---|---|---|---|
| tool:api-definition-search | 11 | 2,3,4,5 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-opus-4.6/scenario-2-code-mode-b64d8fc8b328-4.json |
| Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | 7 | 2,4,5,6 | Code Mode (progressive API discovery), Code Mode (full API context), Regular (with progressive discovery) | Provider/network issue prevented a usable model response. | results/anthropic_claude-opus-4.6/scenario-2-code-mode-b64d8fc8b328-2.json |
| tool:progressive-discovery; schema:false | 5 | 2,3,6 | Regular (with progressive discovery) | Tool step failed: did not discover required tools first. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-6-regular-465d87a69fd4.json |
| No transactions found in the last 7 days. Run the seed script first. | 4 | 1 | Code Mode (progressive API discovery) | Run failed due to benchmark/model mismatch. | results/anthropic_claude-opus-4.6/scenario-1-code-mode-45ffda7f209e-3.json |
| tool:api-definition-search; expected-result:false | 3 | 4,6 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search. Output content did not match the expected answer. | results/anthropic_claude-opus-4.6/scenario-6-code-mode-157d32b71d27-1.json |
| tool:slot-proposal; schema:false | 2 | 5 | Regular (with progressive discovery) | Tool step failed: failed tool group: slot-proposal. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-5-regular-26f6e2a8d5c4.json |
| expected-result:false | 1 | 6 | Code Mode (progressive API discovery) | Output content did not match the expected answer. | results/anthropic_claude-opus-4.6/scenario-6-code-mode-157d32b71d27-2.json |
| tool:customer-source,transaction-window,stats; expected-result:false | 1 | 1 | Regular (without progressive discovery) | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/anthropic_claude-opus-4.6/scenario-1-regular-3a6a0f620d37.json |
| tool:slot-proposal; schema:false; expected-result:false | 1 | 5 | Regular (with progressive discovery) | Tool step failed: failed tool group: slot-proposal. Output format did not match the required schema. Output content did not match the expected answer. | results/anthropic_claude-opus-4.6/scenario-5-regular-fe9f59e2bd91.json |
| tool:progressive-discovery | 1 | 4 | Regular (with progressive discovery) | Tool step failed: did not discover required tools first. | results/anthropic_claude-opus-4.6/scenario-4-regular-f04836145731.json |

## Best Historical Scenario Outcomes

| Scenario | Paradigm | Best Outcome | Failure Detail | Failure Reason (Simple) | Representative Cost (NGN) | Representative Tokens | Representative File |
|---|---|---|---|---|---:|---:|---|
| 1 | Regular (with progressive discovery) | PASS | passed | passed | ₦110.31 | 30,767 | results/anthropic_claude-opus-4.6/scenario-1-regular-68b1da287371.json |
| 1 | Regular (without progressive discovery) | FAIL | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | ₦35.00 | 9,412 | results/anthropic_claude-opus-4.6/scenario-1-regular-3a6a0f620d37.json |
| 1 | Code Mode (progressive API discovery) | FAIL | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | ₦0.00 | 0 | results/anthropic_claude-opus-4.6/scenario-1-code-mode-45ffda7f209e-3.json |
| 1 | Code Mode (full API context) | PASS | passed | passed | ₦9.43 | 1,850 | results/anthropic_claude-opus-4.6/scenario-1-code-mode-68b1da287371.json |
| 2 | Regular (with progressive discovery) | PASS | passed | passed | ₦27.26 | 3,305 | results/anthropic_claude-opus-4.6/scenario-2-regular-8adf617e5971.json |
| 2 | Regular (without progressive discovery) | PASS | passed | passed | ₦22.15 | 1,901 | results/anthropic_claude-opus-4.6/scenario-2-regular-bbede929fddf.json |
| 2 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦15.53 | 2,246 | results/anthropic_claude-opus-4.6/scenario-2-code-mode-b64d8fc8b328-5.json |
| 2 | Code Mode (full API context) | PASS | passed | passed | ₦12.57 | 2,680 | results/anthropic_claude-opus-4.6/scenario-2-code-mode-8adf617e5971.json |
| 3 | Regular (with progressive discovery) | FAIL | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | ₦24.10 | 3,956 | results/anthropic_claude-opus-4.6/scenario-3-regular-e9b0f3e067ff.json |
| 3 | Regular (without progressive discovery) | PASS | passed | passed | ₦16.29 | 2,024 | results/anthropic_claude-opus-4.6/scenario-3-regular-6e7fde7dbe60.json |
| 3 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦11.94 | 2,209 | results/anthropic_claude-opus-4.6/scenario-3-code-mode-bde5143118ac-3.json |
| 3 | Code Mode (full API context) | PASS | passed | passed | ₦9.67 | 1,536 | results/anthropic_claude-opus-4.6/scenario-3-code-mode-e9b0f3e067ff.json |
| 4 | Regular (with progressive discovery) | PASS | passed | passed | ₦19.46 | 3,229 | results/anthropic_claude-opus-4.6/scenario-4-regular-dfb1b3549e8d.json |
| 4 | Regular (without progressive discovery) | PASS | passed | passed | ₦11.41 | 1,407 | results/anthropic_claude-opus-4.6/scenario-4-regular-6b91cd0f906e.json |
| 4 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦10.96 | 1,972 | results/anthropic_claude-opus-4.6/scenario-4-code-mode-4c8bd1e19390-3.json |
| 4 | Code Mode (full API context) | PASS | passed | passed | ₦12.78 | 2,962 | results/anthropic_claude-opus-4.6/scenario-4-code-mode-f04836145731.json |
| 5 | Regular (with progressive discovery) | FAIL | tool:slot-proposal; schema:false; expected-result:false | Tool step failed: failed tool group: slot-proposal. Output format did not match the required schema. Output content did not match the expected answer. | ₦12.36 | 2,669 | results/anthropic_claude-opus-4.6/scenario-5-regular-fe9f59e2bd91.json |
| 5 | Regular (without progressive discovery) | PASS | passed | passed | ₦11.52 | 1,423 | results/anthropic_claude-opus-4.6/scenario-5-regular-535f12c0446e.json |
| 5 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦14.01 | 2,682 | results/anthropic_claude-opus-4.6/scenario-5-code-mode-d76169e36402-3.json |
| 5 | Code Mode (full API context) | PASS | passed | passed | ₦15.76 | 3,261 | results/anthropic_claude-opus-4.6/scenario-5-code-mode-26f6e2a8d5c4.json |
| 6 | Regular (with progressive discovery) | FAIL | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | ₦18.68 | 3,116 | results/anthropic_claude-opus-4.6/scenario-6-regular-3b0383cfadec.json |
| 6 | Regular (without progressive discovery) | PASS | passed | passed | ₦10.51 | 1,365 | results/anthropic_claude-opus-4.6/scenario-6-regular-9066d034612b.json |
| 6 | Code Mode (progressive API discovery) | FAIL | expected-result:false | Output content did not match the expected answer. | ₦9.29 | 1,957 | results/anthropic_claude-opus-4.6/scenario-6-code-mode-157d32b71d27-2.json |
| 6 | Code Mode (full API context) | PASS | passed | passed | ₦6.08 | 1,538 | results/anthropic_claude-opus-4.6/scenario-6-code-mode-465d87a69fd4.json |

## Run History

| Finished At | Scenario | Paradigm | Outcome | Cost (NGN) | Total Tokens | API Calls | Failure Detail | Failure Reason (Simple) | File |
|---|---:|---|---|---:|---:|---:|---|---|---|
| 2026-04-20T18:44:36.337Z | 2 | Code Mode (progressive API discovery) | PASS | ₦15.53 | 2,246 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-2-code-mode-b64d8fc8b328-5.json |
| 2026-04-20T18:44:36.151Z | 3 | Code Mode (progressive API discovery) | PASS | ₦11.94 | 2,209 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-3-code-mode-bde5143118ac-3.json |
| 2026-04-20T18:44:35.675Z | 5 | Code Mode (progressive API discovery) | PASS | ₦14.01 | 2,682 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-5-code-mode-d76169e36402-3.json |
| 2026-04-20T18:44:31.919Z | 4 | Code Mode (progressive API discovery) | PASS | ₦10.96 | 1,972 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-4-code-mode-4c8bd1e19390-3.json |
| 2026-04-20T18:44:28.585Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦9.29 | 1,957 | 1 | expected-result:false | Output content did not match the expected answer. | results/anthropic_claude-opus-4.6/scenario-6-code-mode-157d32b71d27-2.json |
| 2026-04-20T18:44:20.707Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/anthropic_claude-opus-4.6/scenario-1-code-mode-45ffda7f209e-3.json |
| 2026-04-20T18:39:10.106Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦15.33 | 2,268 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-opus-4.6/scenario-2-code-mode-b64d8fc8b328-4.json |
| 2026-04-20T18:39:08.261Z | 5 | Code Mode (progressive API discovery) | FAIL | ₦10.87 | 2,102 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-opus-4.6/scenario-5-code-mode-d76169e36402-2.json |
| 2026-04-20T18:39:05.979Z | 3 | Code Mode (progressive API discovery) | FAIL | ₦11.32 | 2,160 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-opus-4.6/scenario-3-code-mode-bde5143118ac-2.json |
| 2026-04-20T18:39:04.658Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦10.74 | 2,029 | 1 | tool:api-definition-search; expected-result:false | Tool step failed: failed tool group: api-definition-search. Output content did not match the expected answer. | results/anthropic_claude-opus-4.6/scenario-6-code-mode-157d32b71d27-1.json |
| 2026-04-20T18:39:03.451Z | 4 | Code Mode (progressive API discovery) | FAIL | ₦10.96 | 1,972 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-opus-4.6/scenario-4-code-mode-4c8bd1e19390-2.json |
| 2026-04-20T18:38:53.510Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/anthropic_claude-opus-4.6/scenario-1-code-mode-45ffda7f209e-2.json |
| 2026-04-20T18:36:46.242Z | 5 | Code Mode (progressive API discovery) | FAIL | ₦10.87 | 2,102 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-opus-4.6/scenario-5-code-mode-d76169e36402-1.json |
| 2026-04-20T18:36:31.291Z | 4 | Code Mode (progressive API discovery) | FAIL | ₦10.94 | 1,971 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-opus-4.6/scenario-4-code-mode-4c8bd1e19390-1.json |
| 2026-04-20T18:36:03.994Z | 3 | Code Mode (progressive API discovery) | FAIL | ₦14.81 | 2,349 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-opus-4.6/scenario-3-code-mode-bde5143118ac-1.json |
| 2026-04-20T18:35:46.780Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦15.33 | 2,268 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-opus-4.6/scenario-2-code-mode-b64d8fc8b328-3.json |
| 2026-04-20T18:35:07.820Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/anthropic_claude-opus-4.6/scenario-2-code-mode-b64d8fc8b328-2.json |
| 2026-04-20T18:34:44.298Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/anthropic_claude-opus-4.6/scenario-1-code-mode-45ffda7f209e-1.json |
| 2026-04-20T17:31:49.168Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦24.75 | 5,176 | 2 | tool:api-definition-search; expected-result:false | Tool step failed: failed tool group: api-definition-search. Output content did not match the expected answer. | results/anthropic_claude-opus-4.6/scenario-6-code-mode-157d32b71d27.json |
| 2026-04-20T17:31:12.034Z | 5 | Code Mode (progressive API discovery) | FAIL | ₦29.86 | 6,850 | 2 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-opus-4.6/scenario-5-code-mode-d76169e36402.json |
| 2026-04-20T17:30:10.382Z | 4 | Code Mode (progressive API discovery) | FAIL | ₦22.13 | 5,143 | 2 | tool:api-definition-search; expected-result:false | Tool step failed: failed tool group: api-definition-search. Output content did not match the expected answer. | results/anthropic_claude-opus-4.6/scenario-4-code-mode-4c8bd1e19390.json |
| 2026-04-20T17:29:29.019Z | 3 | Code Mode (progressive API discovery) | FAIL | ₦33.00 | 7,176 | 2 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-opus-4.6/scenario-3-code-mode-bde5143118ac.json |
| 2026-04-20T17:28:39.925Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦24.72 | 5,225 | 2 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-opus-4.6/scenario-2-code-mode-b64d8fc8b328-1.json |
| 2026-04-20T17:27:38.304Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/anthropic_claude-opus-4.6/scenario-2-code-mode-b64d8fc8b328.json |
| 2026-04-20T17:27:15.563Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/anthropic_claude-opus-4.6/scenario-1-code-mode-45ffda7f209e.json |
| 2026-04-20T14:53:11.742Z | 6 | Regular (without progressive discovery) | PASS | ₦10.51 | 1,365 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-6-regular-9066d034612b.json |
| 2026-04-20T14:53:01.019Z | 5 | Regular (without progressive discovery) | PASS | ₦11.52 | 1,423 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-5-regular-535f12c0446e.json |
| 2026-04-20T14:52:36.107Z | 4 | Regular (without progressive discovery) | PASS | ₦11.41 | 1,407 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-4-regular-6b91cd0f906e.json |
| 2026-04-20T14:52:24.362Z | 3 | Regular (without progressive discovery) | PASS | ₦16.29 | 2,024 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-3-regular-6e7fde7dbe60.json |
| 2026-04-20T14:52:05.318Z | 2 | Regular (without progressive discovery) | PASS | ₦22.15 | 1,901 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-2-regular-bbede929fddf.json |
| 2026-04-20T14:51:39.945Z | 1 | Regular (without progressive discovery) | FAIL | ₦35.00 | 9,412 | 1 | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/anthropic_claude-opus-4.6/scenario-1-regular-3a6a0f620d37.json |
| 2026-04-20T14:25:06.096Z | 5 | Code Mode (full API context) | PASS | ₦16.98 | 3,352 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-5-code-mode-fe9f59e2bd91.json |
| 2026-04-20T14:24:32.666Z | 5 | Regular (with progressive discovery) | FAIL | ₦12.36 | 2,669 | 2 | tool:slot-proposal; schema:false; expected-result:false | Tool step failed: failed tool group: slot-proposal. Output format did not match the required schema. Output content did not match the expected answer. | results/anthropic_claude-opus-4.6/scenario-5-regular-fe9f59e2bd91.json |
| 2026-04-16T15:32:42.806Z | 6 | Code Mode (full API context) | PASS | ₦6.08 | 1,538 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-6-code-mode-465d87a69fd4.json |
| 2026-04-16T15:32:22.795Z | 6 | Regular (with progressive discovery) | FAIL | ₦18.75 | 3,108 | 2 | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-6-regular-465d87a69fd4.json |
| 2026-04-16T15:31:55.789Z | 5 | Code Mode (full API context) | PASS | ₦15.76 | 3,261 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-5-code-mode-26f6e2a8d5c4.json |
| 2026-04-16T15:31:22.138Z | 5 | Regular (with progressive discovery) | FAIL | ₦12.36 | 2,669 | 2 | tool:slot-proposal; schema:false | Tool step failed: failed tool group: slot-proposal. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-5-regular-26f6e2a8d5c4.json |
| 2026-04-16T15:31:06.935Z | 4 | Code Mode (full API context) | PASS | ₦12.78 | 2,962 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-4-code-mode-f04836145731.json |
| 2026-04-16T15:30:42.128Z | 4 | Regular (with progressive discovery) | FAIL | ₦19.45 | 3,228 | 2 | tool:progressive-discovery | Tool step failed: did not discover required tools first. | results/anthropic_claude-opus-4.6/scenario-4-regular-f04836145731.json |
| 2026-04-16T15:30:19.429Z | 3 | Code Mode (full API context) | PASS | ₦10.86 | 1,595 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-3-code-mode-ba34e868d18b.json |
| 2026-04-16T15:29:30.176Z | 3 | Regular (with progressive discovery) | FAIL | ₦24.17 | 3,962 | 2 | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-3-regular-ba34e868d18b.json |
| 2026-04-16T15:29:08.194Z | 2 | Code Mode (full API context) | PASS | ₦28.04 | 3,809 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-2-code-mode-eebe0d617fe4.json |
| 2026-04-16T15:28:21.738Z | 2 | Regular (with progressive discovery) | FAIL | ₦23.96 | 3,132 | 2 | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-2-regular-eebe0d617fe4.json |
| 2026-04-16T15:27:54.337Z | 1 | Code Mode (full API context) | PASS | ₦9.43 | 1,850 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-1-code-mode-68b1da287371.json |
| 2026-04-16T15:27:29.580Z | 1 | Regular (with progressive discovery) | PASS | ₦110.31 | 30,767 | 2 | passed | passed | results/anthropic_claude-opus-4.6/scenario-1-regular-68b1da287371.json |
| 2026-04-15T22:37:04.528Z | 6 | Code Mode (full API context) | PASS | ₦6.08 | 1,538 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-6-code-mode-3b0383cfadec.json |
| 2026-04-15T22:36:56.277Z | 6 | Regular (with progressive discovery) | FAIL | ₦18.68 | 3,116 | 2 | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-6-regular-3b0383cfadec.json |
| 2026-04-15T22:36:18.773Z | 5 | Code Mode (full API context) | PASS | ₦19.10 | 3,280 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-5-code-mode-bcec74aec51e.json |
| 2026-04-15T22:35:46.391Z | 5 | Regular (with progressive discovery) | FAIL | ₦12.80 | 2,698 | 2 | tool:slot-proposal; schema:false | Tool step failed: failed tool group: slot-proposal. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-5-regular-bcec74aec51e-1.json |
| 2026-04-15T22:35:23.729Z | 4 | Code Mode (full API context) | PASS | ₦27.89 | 6,290 | 2 | passed | passed | results/anthropic_claude-opus-4.6/scenario-4-code-mode-dfb1b3549e8d-1.json |
| 2026-04-15T15:59:57.910Z | 6 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/anthropic_claude-opus-4.6/scenario-6-code-mode-3b0383cfadec-1.json |
| 2026-04-15T15:59:57.447Z | 6 | Regular (with progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/anthropic_claude-opus-4.6/scenario-6-regular-3b0383cfadec-1.json |
| 2026-04-15T15:59:56.926Z | 5 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/anthropic_claude-opus-4.6/scenario-5-code-mode-bcec74aec51e-1.json |
| 2026-04-15T15:59:56.490Z | 5 | Regular (with progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/anthropic_claude-opus-4.6/scenario-5-regular-bcec74aec51e.json |
| 2026-04-15T15:59:56.031Z | 4 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/anthropic_claude-opus-4.6/scenario-4-code-mode-dfb1b3549e8d.json |
| 2026-04-14T18:24:30.418Z | 4 | Regular (with progressive discovery) | PASS | ₦19.46 | 3,229 | 2 | passed | passed | results/anthropic_claude-opus-4.6/scenario-4-regular-dfb1b3549e8d.json |
| 2026-04-14T18:24:09.396Z | 3 | Code Mode (full API context) | PASS | ₦9.67 | 1,536 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-3-code-mode-e9b0f3e067ff.json |
| 2026-04-14T18:23:53.081Z | 3 | Regular (with progressive discovery) | FAIL | ₦24.10 | 3,956 | 2 | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-3-regular-e9b0f3e067ff.json |
| 2026-04-14T18:23:30.442Z | 2 | Code Mode (full API context) | PASS | ₦12.57 | 2,680 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-2-code-mode-8adf617e5971.json |
| 2026-04-14T18:23:03.480Z | 2 | Regular (with progressive discovery) | PASS | ₦27.26 | 3,305 | 2 | passed | passed | results/anthropic_claude-opus-4.6/scenario-2-regular-8adf617e5971.json |
| 2026-04-14T18:22:28.831Z | 1 | Code Mode (full API context) | PASS | ₦11.22 | 2,404 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-1-code-mode-6cebec045de6.json |
| 2026-04-14T18:21:13.765Z | 1 | Regular (with progressive discovery) | PASS | ₦144.27 | 39,967 | 3 | passed | passed | results/anthropic_claude-opus-4.6/scenario-1-regular-6cebec045de6.json |

