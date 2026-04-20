# openai/gpt-5.4

Official FX conversion in this report uses the official CBN NFEM weighted average rate as at April-20-2026.

## Summary

| Paradigm | Best Passes | Covered Scenarios (max 6) | Best Pass Rate | Recorded Runs | Avg Input Tokens / Run | Avg Output Tokens / Run | Avg Total Tokens / Run | Avg Cost / Run (NGN) | Avg API Calls / Run | Attempts / Covered Scenario | Non-model Fail Runs | Benchmark/Model Fail Runs | Avg Recovery Cost (NGN) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 5/6 | 6/6 | 83.3% | 14 | 2,591 | 196 | 2,787 | ₦12.70 | 2.00 | 2.33 | 0 | 1 | ₦8.40 |
| Regular (without progressive discovery) | 4/6 | 6/6 | 66.7% | 6 | 606 | 114 | 720 | ₦4.35 | 1.00 | 1.00 | 0 | 2 | n/a |
| Code Mode (progressive API discovery) | 4/6 | 6/6 | 66.7% | 13 | 871 | 111 | 981 | ₦5.18 | 0.83 | 2.17 | 0 | 2 | ₦14.27 |
| Code Mode (full API context) | 6/6 | 6/6 | 100.0% | 19 | 1,067 | 6 | 1,073 | ₦3.73 | 1.00 | 3.17 | 0 | 0 | n/a |

## Best Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 6 | 83.3% | 2,591 | 196 | 2,787 | ₦12.70 | 2.00 | 12,112 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 66.7% | 606 | 114 | 720 | ₦4.35 | 1.00 | 9,288 ms | 0.00 |
| Code Mode (progressive API discovery) | 6 | 66.7% | 871 | 111 | 981 | ₦5.18 | 0.83 | 13,539 ms | 0.00 |
| Code Mode (full API context) | 6 | 100.0% | 1,067 | 6 | 1,073 | ₦3.73 | 1.00 | 21,588 ms | 0.00 |

## Worst Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 6 | 33.3% | 1,384 | 207 | 1,591 | ₦8.86 | 2.00 | 11,613 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 66.7% | 606 | 114 | 720 | ₦4.35 | 1.00 | 9,288 ms | 0.00 |
| Code Mode (progressive API discovery) | 6 | 16.7% | 2,228 | 164 | 2,392 | ₦10.84 | 2.17 | 8,947 ms | 2.00 |
| Code Mode (full API context) | 6 | 83.3% | 1,123 | 5 | 1,128 | ₦3.89 | 0.83 | 19,779 ms | 0.00 |

## Average Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 11 | 45.5% | 1,855 | 163 | 2,018 | ₦9.56 | 1.64 | 11,003 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 66.7% | 606 | 114 | 720 | ₦4.35 | 1.00 | 9,288 ms | 0.00 |
| Code Mode (progressive API discovery) | 13 | 30.8% | 1,458 | 130 | 1,587 | ₦7.55 | 1.38 | 11,564 ms | 0.92 |
| Code Mode (full API context) | 17 | 64.7% | 773 | 4 | 777 | ₦2.69 | 0.65 | 20,766 ms | 0.00 |

## Recovery Benchmarks

Lower is better for retries, cost, and time.

| Paradigm | Recovered Cases | Avg Retries To Recover | Avg Recovery Cost (NGN) | Avg Recovery Time |
|---|---:|---:|---:|---:|
| Regular (with progressive discovery) | 2 | 1.00 | ₦8.40 | 900,658 ms |
| Regular (without progressive discovery) | 0 | n/a | n/a | n/a |
| Code Mode (progressive API discovery) | 3 | 1.00 | ₦14.27 | 2,424,026 ms |
| Code Mode (full API context) | 0 | n/a | n/a | n/a |

## Failure Analysis (All Recorded Rounds)

Total rounds: **57**
Failed rounds: **33**

| Paradigm | Recorded Rounds | Failed Rounds | Failure Rate | Non-model Failures | Benchmark/Model Failures |
|---|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 14 | 9 | 64.3% | 3 | 6 |
| Regular (without progressive discovery) | 6 | 2 | 33.3% | 0 | 2 |
| Code Mode (progressive API discovery) | 18 | 14 | 77.8% | 0 | 14 |
| Code Mode (full API context) | 19 | 8 | 42.1% | 2 | 6 |

| Failure Reason | Count | Scenarios | Paradigms | Human-readable reason | Latest Example File |
|---|---:|---|---|---|---|
| tool:api-definition-search | 5 | 2,3,4,5 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search. | results/openai_gpt-5.4/scenario-5-code-mode-771687aa9714-1.json |
| tool:api-definition-search,code-execution; schema:false; expected-result:false | 4 | 2,3,5,6 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search; did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | results/openai_gpt-5.4/scenario-6-code-mode-f4bfcdb81370.json |
| No transactions found in the last 7 days. Run the seed script first. | 3 | 1 | Code Mode (progressive API discovery) | Run failed due to benchmark/model mismatch. | results/openai_gpt-5.4/scenario-1-code-mode-7c043a3b7ed8-2.json |
| Provider returned error | 3 | 2,3 | Regular (with progressive discovery) | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4/scenario-2-regular-b74d97c3aa02-1.json |
| tool:customer-source,transaction-window,stats; expected-result:false | 2 | 1 | Regular (without progressive discovery), Regular (with progressive discovery) | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/openai_gpt-5.4/scenario-1-regular-2653c36d8469.json |
| Unexpected HTTP client error: Error: unknown certificate verification error | 2 | 5,6 | Code Mode (full API context) | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4/scenario-6-code-mode-5409489c2e19-1.json |
| expected-result:false | 1 | 6 | Code Mode (progressive API discovery) | Output content did not match the expected answer. | results/openai_gpt-5.4/scenario-6-code-mode-f4bfcdb81370-2.json |
| tool:api-definition-search; expected-result:false | 1 | 6 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search. Output content did not match the expected answer. | results/openai_gpt-5.4/scenario-6-code-mode-f4bfcdb81370-1.json |
| tool:site-inspection; schema:false; expected-result:false | 1 | 2 | Regular (without progressive discovery) | Tool step failed: did not inspect the target website as required. Output format did not match the required schema. Output content did not match the expected answer. | results/openai_gpt-5.4/scenario-2-regular-847574b93b99.json |
| tool:progressive-discovery,channel-summary; schema:false | 1 | 3 | Regular (with progressive discovery) | Tool step failed: did not discover required tools first; did not summarize the Slack channel correctly. Output format did not match the required schema. | results/openai_gpt-5.4/scenario-3-regular-04e38921bf86.json |
| tool:site-inspection; schema:false | 1 | 2 | Regular (with progressive discovery) | Tool step failed: did not inspect the target website as required. Output format did not match the required schema. | results/openai_gpt-5.4/scenario-2-regular-b74d97c3aa02-2.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-09T16:11:09.860Z,2026-04-16T16:11:09.860Z,50000 | 1 | 1 | Regular (with progressive discovery) | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4/scenario-1-regular-7c043a3b7ed8.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-09T16:10:51.076Z,2026-04-16T16:10:51.076Z,50000 | 1 | 1 | Regular (with progressive discovery) | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4/scenario-1-regular-7c043a3b7ed8-1.json |
| tool:progressive-discovery,repo-change-pr; schema:false | 1 | 6 | Regular (with progressive discovery) | Tool step failed: did not discover required tools first; did not produce the expected repo change and PR output. Output format did not match the required schema. | results/openai_gpt-5.4/scenario-6-regular-ab541b6b0e89.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-08T23:16:33.707Z,2026-04-15T23:16:33.707Z,50000 | 1 | 1 | Code Mode (full API context) | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4/scenario-1-code-mode-1342a3c53494-4.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-08T22:46:34.366Z,2026-04-15T22:46:34.366Z,50000 | 1 | 1 | Code Mode (full API context) | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4/scenario-1-code-mode-1342a3c53494.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-08T15:49:03.540Z,2026-04-15T15:49:03.540Z,50000 | 1 | 1 | Code Mode (full API context) | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4/scenario-1-code-mode-1342a3c53494-2.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:25:49.998Z,2026-04-14T18:25:49.998Z,50000 | 1 | 1 | Code Mode (full API context) | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4/scenario-1-code-mode-1342a3c53494-6.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:13:30.704Z,2026-04-14T18:13:30.704Z,50000 | 1 | 1 | Code Mode (full API context) | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4/scenario-1-code-mode-1342a3c53494-3.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:13:01.097Z,2026-04-14T18:13:01.097Z,50000 | 1 | 1 | Code Mode (full API context) | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4/scenario-1-code-mode-1342a3c53494-1.json |

## Best Historical Scenario Outcomes

| Scenario | Paradigm | Best Outcome | Failure Detail | Failure Reason (Simple) | Representative Cost (NGN) | Representative Tokens | Representative File |
|---|---|---|---|---|---:|---:|---|
| 1 | Regular (with progressive discovery) | PASS | passed | passed | ₦37.16 | 10,312 | results/openai_gpt-5.4/scenario-1-regular-1342a3c53494.json |
| 1 | Regular (without progressive discovery) | FAIL | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | ₦6.54 | 1,587 | results/openai_gpt-5.4/scenario-1-regular-2653c36d8469.json |
| 1 | Code Mode (progressive API discovery) | FAIL | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | ₦0.00 | 0 | results/openai_gpt-5.4/scenario-1-code-mode-7c043a3b7ed8-2.json |
| 1 | Code Mode (full API context) | PASS | passed | passed | ₦7.85 | 2,297 | results/openai_gpt-5.4/scenario-1-code-mode-1342a3c53494-5.json |
| 2 | Regular (with progressive discovery) | PASS | passed | passed | ₦6.72 | 923 | results/openai_gpt-5.4/scenario-2-regular-9ce2c52840e5.json |
| 2 | Regular (without progressive discovery) | FAIL | tool:site-inspection; schema:false; expected-result:false | Tool step failed: did not inspect the target website as required. Output format did not match the required schema. Output content did not match the expected answer. | ₦4.64 | 504 | results/openai_gpt-5.4/scenario-2-regular-847574b93b99.json |
| 2 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦7.67 | 1,348 | results/openai_gpt-5.4/scenario-2-code-mode-af7083867e27-1.json |
| 2 | Code Mode (full API context) | PASS | passed | passed | ₦3.75 | 1,078 | results/openai_gpt-5.4/scenario-2-code-mode-b74d97c3aa02.json |
| 3 | Regular (with progressive discovery) | PASS | passed | passed | ₦8.13 | 1,423 | results/openai_gpt-5.4/scenario-3-regular-d598e1859cba.json |
| 3 | Regular (without progressive discovery) | PASS | passed | passed | ₦4.92 | 844 | results/openai_gpt-5.4/scenario-3-regular-e60740fa77db.json |
| 3 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦6.22 | 1,208 | results/openai_gpt-5.4/scenario-3-code-mode-6ac1f37fe268-1.json |
| 3 | Code Mode (full API context) | PASS | passed | passed | ₦3.28 | 943 | results/openai_gpt-5.4/scenario-3-code-mode-391c3ca7451f.json |
| 4 | Regular (with progressive discovery) | PASS | passed | passed | ₦6.34 | 1,213 | results/openai_gpt-5.4/scenario-4-regular-5d4ae2aa3957.json |
| 4 | Regular (without progressive discovery) | PASS | passed | passed | ₦3.14 | 432 | results/openai_gpt-5.4/scenario-4-regular-706abe281ab5.json |
| 4 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦4.97 | 973 | results/openai_gpt-5.4/scenario-4-code-mode-60767e7c70bb-2.json |
| 4 | Code Mode (full API context) | PASS | passed | passed | ₦1.87 | 523 | results/openai_gpt-5.4/scenario-4-code-mode-5d4ae2aa3957.json |
| 5 | Regular (with progressive discovery) | PASS | passed | passed | ₦10.87 | 1,632 | results/openai_gpt-5.4/scenario-5-regular-af1a0e48b148.json |
| 5 | Regular (without progressive discovery) | PASS | passed | passed | ₦3.23 | 462 | results/openai_gpt-5.4/scenario-5-regular-89389e187b1d.json |
| 5 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦5.66 | 1,106 | results/openai_gpt-5.4/scenario-5-code-mode-771687aa9714-2.json |
| 5 | Code Mode (full API context) | PASS | passed | passed | ₦3.68 | 1,062 | results/openai_gpt-5.4/scenario-5-code-mode-af1a0e48b148.json |
| 6 | Regular (with progressive discovery) | FAIL | tool:progressive-discovery,repo-change-pr; schema:false | Tool step failed: did not discover required tools first; did not produce the expected repo change and PR output. Output format did not match the required schema. | ₦6.99 | 1,217 | results/openai_gpt-5.4/scenario-6-regular-ab541b6b0e89.json |
| 6 | Regular (without progressive discovery) | PASS | passed | passed | ₦3.63 | 491 | results/openai_gpt-5.4/scenario-6-regular-473f1f203717.json |
| 6 | Code Mode (progressive API discovery) | FAIL | expected-result:false | Output content did not match the expected answer. | ₦6.56 | 1,253 | results/openai_gpt-5.4/scenario-6-code-mode-f4bfcdb81370-2.json |
| 6 | Code Mode (full API context) | PASS | passed | passed | ₦1.91 | 537 | results/openai_gpt-5.4/scenario-6-code-mode-5409489c2e19.json |

## Run History

| Finished At | Scenario | Paradigm | Outcome | Cost (NGN) | Total Tokens | API Calls | Failure Detail | Failure Reason (Simple) | File |
|---|---:|---|---|---:|---:|---:|---|---|---|
| 2026-04-20T18:46:06.421Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦6.56 | 1,253 | 1 | expected-result:false | Output content did not match the expected answer. | results/openai_gpt-5.4/scenario-6-code-mode-f4bfcdb81370-2.json |
| 2026-04-20T18:46:05.303Z | 5 | Code Mode (progressive API discovery) | PASS | ₦5.66 | 1,106 | 1 | passed | passed | results/openai_gpt-5.4/scenario-5-code-mode-771687aa9714-2.json |
| 2026-04-20T18:45:54.579Z | 3 | Code Mode (progressive API discovery) | PASS | ₦6.22 | 1,208 | 1 | passed | passed | results/openai_gpt-5.4/scenario-3-code-mode-6ac1f37fe268-1.json |
| 2026-04-20T18:45:54.238Z | 4 | Code Mode (progressive API discovery) | PASS | ₦4.97 | 973 | 1 | passed | passed | results/openai_gpt-5.4/scenario-4-code-mode-60767e7c70bb-2.json |
| 2026-04-20T18:45:47.634Z | 2 | Code Mode (progressive API discovery) | PASS | ₦7.67 | 1,348 | 1 | passed | passed | results/openai_gpt-5.4/scenario-2-code-mode-af7083867e27-1.json |
| 2026-04-20T18:45:37.233Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/openai_gpt-5.4/scenario-1-code-mode-7c043a3b7ed8-2.json |
| 2026-04-20T18:40:33.185Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦6.94 | 1,368 | 1 | tool:api-definition-search; expected-result:false | Tool step failed: failed tool group: api-definition-search. Output content did not match the expected answer. | results/openai_gpt-5.4/scenario-6-code-mode-f4bfcdb81370-1.json |
| 2026-04-20T18:40:29.728Z | 5 | Code Mode (progressive API discovery) | FAIL | ₦6.07 | 1,230 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/openai_gpt-5.4/scenario-5-code-mode-771687aa9714-1.json |
| 2026-04-20T18:40:16.426Z | 4 | Code Mode (progressive API discovery) | FAIL | ₦4.93 | 962 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/openai_gpt-5.4/scenario-4-code-mode-60767e7c70bb-1.json |
| 2026-04-20T18:40:13.418Z | 3 | Code Mode (progressive API discovery) | FAIL | ₦6.15 | 1,186 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/openai_gpt-5.4/scenario-3-code-mode-6ac1f37fe268.json |
| 2026-04-20T18:40:09.162Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦7.67 | 1,349 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/openai_gpt-5.4/scenario-2-code-mode-af7083867e27.json |
| 2026-04-20T18:39:59.020Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/openai_gpt-5.4/scenario-1-code-mode-7c043a3b7ed8-1.json |
| 2026-04-20T18:07:02.480Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦17.29 | 4,143 | 3 | tool:api-definition-search,code-execution; schema:false; expected-result:false | Tool step failed: failed tool group: api-definition-search; did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | results/openai_gpt-5.4/scenario-6-code-mode-f4bfcdb81370.json |
| 2026-04-20T18:06:25.837Z | 5 | Code Mode (progressive API discovery) | FAIL | ₦10.19 | 2,160 | 3 | tool:api-definition-search,code-execution; schema:false; expected-result:false | Tool step failed: failed tool group: api-definition-search; did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | results/openai_gpt-5.4/scenario-5-code-mode-771687aa9714.json |
| 2026-04-20T18:06:06.949Z | 4 | Code Mode (progressive API discovery) | FAIL | ₦8.45 | 1,529 | 2 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/openai_gpt-5.4/scenario-4-code-mode-60767e7c70bb.json |
| 2026-04-20T18:05:50.500Z | 3 | Code Mode (progressive API discovery) | FAIL | ₦20.49 | 4,218 | 3 | tool:api-definition-search,code-execution; schema:false; expected-result:false | Tool step failed: failed tool group: api-definition-search; did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | results/openai_gpt-5.4/scenario-3-code-mode-d598e1859cba.json |
| 2026-04-20T18:05:21.820Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦12.13 | 2,859 | 3 | tool:api-definition-search,code-execution; schema:false; expected-result:false | Tool step failed: failed tool group: api-definition-search; did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | results/openai_gpt-5.4/scenario-2-code-mode-9ce2c52840e5.json |
| 2026-04-20T18:04:58.661Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/openai_gpt-5.4/scenario-1-code-mode-7c043a3b7ed8.json |
| 2026-04-20T16:09:00.930Z | 6 | Regular (without progressive discovery) | PASS | ₦3.63 | 491 | 1 | passed | passed | results/openai_gpt-5.4/scenario-6-regular-473f1f203717.json |
| 2026-04-20T16:08:47.828Z | 5 | Regular (without progressive discovery) | PASS | ₦3.23 | 462 | 1 | passed | passed | results/openai_gpt-5.4/scenario-5-regular-89389e187b1d.json |
| 2026-04-20T16:08:39.806Z | 4 | Regular (without progressive discovery) | PASS | ₦3.14 | 432 | 1 | passed | passed | results/openai_gpt-5.4/scenario-4-regular-706abe281ab5.json |
| 2026-04-20T16:08:31.037Z | 3 | Regular (without progressive discovery) | PASS | ₦4.92 | 844 | 1 | passed | passed | results/openai_gpt-5.4/scenario-3-regular-e60740fa77db.json |
| 2026-04-20T16:08:21.102Z | 2 | Regular (without progressive discovery) | FAIL | ₦4.64 | 504 | 1 | tool:site-inspection; schema:false; expected-result:false | Tool step failed: did not inspect the target website as required. Output format did not match the required schema. Output content did not match the expected answer. | results/openai_gpt-5.4/scenario-2-regular-847574b93b99.json |
| 2026-04-20T16:08:11.874Z | 1 | Regular (without progressive discovery) | FAIL | ₦6.54 | 1,587 | 1 | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/openai_gpt-5.4/scenario-1-regular-2653c36d8469.json |
| 2026-04-16T16:31:40.195Z | 3 | Regular (with progressive discovery) | PASS | ₦8.13 | 1,423 | 2 | passed | passed | results/openai_gpt-5.4/scenario-3-regular-d598e1859cba.json |
| 2026-04-16T16:31:17.305Z | 2 | Regular (with progressive discovery) | PASS | ₦6.72 | 923 | 2 | passed | passed | results/openai_gpt-5.4/scenario-2-regular-9ce2c52840e5.json |
| 2026-04-16T16:17:30.629Z | 1 | Regular (with progressive discovery) | FAIL | ₦12.18 | 3,041 | 2 | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/openai_gpt-5.4/scenario-1-regular-7c043a3b7ed8-2.json |
| 2026-04-16T16:16:37.474Z | 3 | Regular (with progressive discovery) | FAIL | ₦9.99 | 1,515 | 2 | tool:progressive-discovery,channel-summary; schema:false | Tool step failed: did not discover required tools first; did not summarize the Slack channel correctly. Output format did not match the required schema. | results/openai_gpt-5.4/scenario-3-regular-04e38921bf86.json |
| 2026-04-16T16:16:35.885Z | 2 | Regular (with progressive discovery) | FAIL | ₦6.81 | 927 | 2 | tool:site-inspection; schema:false | Tool step failed: did not inspect the target website as required. Output format did not match the required schema. | results/openai_gpt-5.4/scenario-2-regular-b74d97c3aa02-2.json |
| 2026-04-16T16:15:37.983Z | 2 | Regular (with progressive discovery) | FAIL | ₦1.73 | 398 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4/scenario-2-regular-b74d97c3aa02-1.json |
| 2026-04-16T16:11:10.656Z | 1 | Regular (with progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-09T16:11:09.860Z,2026-04-16T16:11:09.860Z,50000 | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4/scenario-1-regular-7c043a3b7ed8.json |
| 2026-04-16T16:10:52.184Z | 1 | Regular (with progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-09T16:10:51.076Z,2026-04-16T16:10:51.076Z,50000 | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4/scenario-1-regular-7c043a3b7ed8-1.json |
| 2026-04-16T16:01:40.296Z | 3 | Regular (with progressive discovery) | FAIL | ₦2.19 | 533 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4/scenario-3-regular-04e38921bf86-1.json |
| 2026-04-16T16:01:12.451Z | 2 | Regular (with progressive discovery) | FAIL | ₦2.05 | 414 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4/scenario-2-regular-b74d97c3aa02.json |
| 2026-04-16T15:25:07.143Z | 6 | Code Mode (full API context) | PASS | ₦1.94 | 545 | 1 | passed | passed | results/openai_gpt-5.4/scenario-6-code-mode-ab541b6b0e89.json |
| 2026-04-16T15:24:41.629Z | 6 | Regular (with progressive discovery) | FAIL | ₦6.99 | 1,217 | 2 | tool:progressive-discovery,repo-change-pr; schema:false | Tool step failed: did not discover required tools first; did not produce the expected repo change and PR output. Output format did not match the required schema. | results/openai_gpt-5.4/scenario-6-regular-ab541b6b0e89.json |
| 2026-04-16T15:23:56.993Z | 5 | Code Mode (full API context) | PASS | ₦3.68 | 1,062 | 1 | passed | passed | results/openai_gpt-5.4/scenario-5-code-mode-af1a0e48b148.json |
| 2026-04-16T15:23:43.502Z | 5 | Regular (with progressive discovery) | PASS | ₦10.87 | 1,632 | 2 | passed | passed | results/openai_gpt-5.4/scenario-5-regular-af1a0e48b148.json |
| 2026-04-16T15:23:31.460Z | 4 | Code Mode (full API context) | PASS | ₦1.87 | 523 | 1 | passed | passed | results/openai_gpt-5.4/scenario-4-code-mode-5d4ae2aa3957.json |
| 2026-04-16T15:22:50.790Z | 4 | Regular (with progressive discovery) | PASS | ₦6.34 | 1,213 | 2 | passed | passed | results/openai_gpt-5.4/scenario-4-regular-5d4ae2aa3957.json |
| 2026-04-16T15:22:19.108Z | 3 | Code Mode (full API context) | PASS | ₦4.54 | 1,316 | 1 | passed | passed | results/openai_gpt-5.4/scenario-3-code-mode-04e38921bf86.json |
| 2026-04-16T15:21:43.488Z | 2 | Code Mode (full API context) | PASS | ₦3.75 | 1,078 | 1 | passed | passed | results/openai_gpt-5.4/scenario-2-code-mode-b74d97c3aa02.json |
| 2026-04-16T15:21:06.922Z | 1 | Code Mode (full API context) | PASS | ₦7.85 | 2,297 | 1 | passed | passed | results/openai_gpt-5.4/scenario-1-code-mode-1342a3c53494-5.json |
| 2026-04-16T15:20:24.944Z | 1 | Regular (with progressive discovery) | PASS | ₦37.16 | 10,312 | 2 | passed | passed | results/openai_gpt-5.4/scenario-1-regular-1342a3c53494.json |
| 2026-04-15T23:16:44.912Z | 1 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-08T23:16:33.707Z,2026-04-15T23:16:33.707Z,50000 | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4/scenario-1-code-mode-1342a3c53494-4.json |
| 2026-04-15T22:47:14.203Z | 6 | Code Mode (full API context) | PASS | ₦1.91 | 537 | 1 | passed | passed | results/openai_gpt-5.4/scenario-6-code-mode-5409489c2e19.json |
| 2026-04-15T22:46:57.542Z | 5 | Code Mode (full API context) | PASS | ₦8.27 | 2,422 | 1 | passed | passed | results/openai_gpt-5.4/scenario-5-code-mode-26b62ad3840b-1.json |
| 2026-04-15T22:46:35.671Z | 1 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-08T22:46:34.366Z,2026-04-15T22:46:34.366Z,50000 | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4/scenario-1-code-mode-1342a3c53494.json |
| 2026-04-15T15:51:50.296Z | 6 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: unknown certificate verification error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4/scenario-6-code-mode-5409489c2e19-1.json |
| 2026-04-15T15:51:17.602Z | 5 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: unknown certificate verification error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4/scenario-5-code-mode-26b62ad3840b.json |
| 2026-04-15T15:49:46.088Z | 4 | Code Mode (full API context) | PASS | ₦2.79 | 796 | 1 | passed | passed | results/openai_gpt-5.4/scenario-4-code-mode-c3b6cc5f3b40.json |
| 2026-04-15T15:49:04.337Z | 1 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-08T15:49:03.540Z,2026-04-15T15:49:03.540Z,50000 | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4/scenario-1-code-mode-1342a3c53494-2.json |
| 2026-04-14T18:26:50.568Z | 3 | Code Mode (full API context) | PASS | ₦3.28 | 943 | 1 | passed | passed | results/openai_gpt-5.4/scenario-3-code-mode-391c3ca7451f.json |
| 2026-04-14T18:26:23.160Z | 2 | Code Mode (full API context) | PASS | ₦5.82 | 1,691 | 1 | passed | passed | results/openai_gpt-5.4/scenario-2-code-mode-b74d97c3aa02-1.json |
| 2026-04-14T18:25:50.838Z | 1 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:25:49.998Z,2026-04-14T18:25:49.998Z,50000 | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4/scenario-1-code-mode-1342a3c53494-6.json |
| 2026-04-14T18:13:31.516Z | 1 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:13:30.704Z,2026-04-14T18:13:30.704Z,50000 | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4/scenario-1-code-mode-1342a3c53494-3.json |
| 2026-04-14T18:13:01.951Z | 1 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:13:01.097Z,2026-04-14T18:13:01.097Z,50000 | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4/scenario-1-code-mode-1342a3c53494-1.json |

