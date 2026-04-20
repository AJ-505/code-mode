# google/gemini-3.1-flash-lite-preview

Official FX conversion in this report uses the official CBN NFEM weighted average rate as at April-20-2026.

## Summary

| Paradigm | Best Passes | Covered Scenarios (max 6) | Best Pass Rate | Recorded Runs | Avg Input Tokens / Run | Avg Output Tokens / Run | Avg Total Tokens / Run | Avg Cost / Run (NGN) | Avg API Calls / Run | Attempts / Covered Scenario | Non-model Fail Runs | Benchmark/Model Fail Runs | Avg Recovery Cost (NGN) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 1/6 | 6/6 | 16.7% | 6 | 2,542 | 170 | 2,712 | ₦1.20 | 2.00 | 1.00 | 0 | 5 | n/a |
| Regular (without progressive discovery) | 5/6 | 6/6 | 83.3% | 6 | 341 | 145 | 486 | ₦0.41 | 0.83 | 1.00 | 0 | 1 | n/a |
| Code Mode (progressive API discovery) | 2/6 | 6/6 | 33.3% | 21 | 3,120 | 239 | 3,359 | ₦1.54 | 1.83 | 3.50 | 0 | 4 | n/a |
| Code Mode (full API context) | 1/6 | 6/6 | 16.7% | 6 | 3,055 | 281 | 3,336 | ₦1.60 | 2.00 | 1.00 | 1 | 4 | n/a |

## Best Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 6 | 16.7% | 2,542 | 170 | 2,712 | ₦1.20 | 2.00 | 6,954 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 83.3% | 341 | 145 | 486 | ₦0.41 | 0.83 | 12,240 ms | 0.00 |
| Code Mode (progressive API discovery) | 6 | 33.3% | 3,120 | 239 | 3,359 | ₦1.54 | 1.83 | 9,964 ms | 1.50 |
| Code Mode (full API context) | 5 | 20.0% | 3,020 | 225 | 3,245 | ₦1.47 | 2.00 | 11,688 ms | 1.40 |

## Worst Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 6 | 16.7% | 2,542 | 170 | 2,712 | ₦1.20 | 2.00 | 6,954 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 83.3% | 341 | 145 | 486 | ₦0.41 | 0.83 | 12,240 ms | 0.00 |
| Code Mode (progressive API discovery) | 6 | 33.3% | 3,158 | 251 | 3,409 | ₦1.57 | 1.83 | 10,714 ms | 1.50 |
| Code Mode (full API context) | 5 | 20.0% | 3,020 | 225 | 3,245 | ₦1.47 | 2.00 | 11,688 ms | 1.40 |

## Average Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 6 | 16.7% | 2,542 | 170 | 2,712 | ₦1.20 | 2.00 | 6,954 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 83.3% | 341 | 145 | 486 | ₦0.41 | 0.83 | 12,240 ms | 0.00 |
| Code Mode (progressive API discovery) | 10 | 20.0% | 2,499 | 205 | 2,704 | ₦1.26 | 1.50 | 9,949 ms | 1.20 |
| Code Mode (full API context) | 5 | 20.0% | 3,020 | 225 | 3,245 | ₦1.47 | 2.00 | 11,688 ms | 1.40 |

## Recovery Benchmarks

Lower is better for retries, cost, and time.

| Paradigm | Recovered Cases | Avg Retries To Recover | Avg Recovery Cost (NGN) | Avg Recovery Time |
|---|---:|---:|---:|---:|
| Regular (with progressive discovery) | 0 | n/a | n/a | n/a |
| Regular (without progressive discovery) | 0 | n/a | n/a | n/a |
| Code Mode (progressive API discovery) | 0 | n/a | n/a | n/a |
| Code Mode (full API context) | 0 | n/a | n/a | n/a |

## Failure Analysis (All Recorded Rounds)

Total rounds: **41**
Failed rounds: **32**

| Paradigm | Recorded Rounds | Failed Rounds | Failure Rate | Non-model Failures | Benchmark/Model Failures |
|---|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 6 | 5 | 83.3% | 0 | 5 |
| Regular (without progressive discovery) | 6 | 1 | 16.7% | 0 | 1 |
| Code Mode (progressive API discovery) | 23 | 21 | 91.3% | 11 | 10 |
| Code Mode (full API context) | 6 | 5 | 83.3% | 1 | 4 |

| Failure Reason | Count | Scenarios | Paradigms | Human-readable reason | Latest Example File |
|---|---:|---|---|---|---|
| Provider returned error | 9 | 2,3,4,5,6 | Code Mode (progressive API discovery), Code Mode (full API context) | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-flash-lite-preview/scenario-3-code-mode-61a2fe1f513b-3.json |
| expected-result:false | 3 | 1,4,6 | Code Mode (progressive API discovery), Code Mode (full API context) | Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-6-code-mode-f496763e3e77-3.json |
| Response failed: {"code":"server_error","message":"internal stream ended unexpectedly"} | 3 | 2,4,6 | Code Mode (progressive API discovery) | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-flash-lite-preview/scenario-6-code-mode-f496763e3e77.json |
| tool:progressive-discovery; schema:false; expected-result:false | 3 | 3,4,6 | Regular (with progressive discovery) | Tool step failed: did not discover required tools first. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-6-regular-70b6098dea20.json |
| tool:api-definition-search,code-execution; schema:false; expected-result:false | 2 | 2,3 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search; did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-2-code-mode-3cb080c89f64-3.json |
| No transactions found in the last 7 days. Run the seed script first. | 2 | 1 | Code Mode (progressive API discovery) | Run failed due to benchmark/model mismatch. | results/google_gemini-3.1-flash-lite-preview/scenario-1-code-mode-3932da03d4fb-2.json |
| tool:api-definition-search | 2 | 4,5 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search. | results/google_gemini-3.1-flash-lite-preview/scenario-5-code-mode-cf0c788c2d91-3.json |
| schema:false; expected-result:false | 2 | 2,5 | Regular (with progressive discovery), Code Mode (full API context) | Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-5-regular-cf0c788c2d91.json |
| tool:api-definition-search; schema:false; expected-result:false | 1 | 2 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-2-code-mode-3cb080c89f64-2.json |
| tool:api-definition-search; expected-result:false | 1 | 6 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-6-code-mode-f496763e3e77-2.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-13T17:42:58.957Z,2026-04-20T17:42:58.957Z,50000 | 1 | 1 | Code Mode (progressive API discovery) | Scenario database query failed before the run could be evaluated. | results/google_gemini-3.1-flash-lite-preview/scenario-1-code-mode-3932da03d4fb.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-13T16:03:08.009Z,2026-04-20T16:03:08.009Z,50000 | 1 | 1 | Regular (without progressive discovery) | Scenario database query failed before the run could be evaluated. | results/google_gemini-3.1-flash-lite-preview/scenario-1-regular-303c7aaed28d.json |
| tool:code-execution; schema:false; expected-result:false | 1 | 3 | Code Mode (full API context) | Tool step failed: did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-3-code-mode-292c220117a9.json |
| tool:customer-source,transaction-window,stats; expected-result:false | 1 | 1 | Regular (with progressive discovery) | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-1-regular-4bb46306bceb.json |

## Best Historical Scenario Outcomes

| Scenario | Paradigm | Best Outcome | Failure Detail | Failure Reason (Simple) | Representative Cost (NGN) | Representative Tokens | Representative File |
|---|---|---|---|---|---:|---:|---|
| 1 | Regular (with progressive discovery) | FAIL | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | ₦4.12 | 11,398 | results/google_gemini-3.1-flash-lite-preview/scenario-1-regular-4bb46306bceb.json |
| 1 | Regular (without progressive discovery) | FAIL | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-13T16:03:08.009Z,2026-04-20T16:03:08.009Z,50000 | Scenario database query failed before the run could be evaluated. | ₦0.00 | 0 | results/google_gemini-3.1-flash-lite-preview/scenario-1-regular-303c7aaed28d.json |
| 1 | Code Mode (progressive API discovery) | FAIL | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | ₦0.00 | 0 | results/google_gemini-3.1-flash-lite-preview/scenario-1-code-mode-3932da03d4fb-2.json |
| 1 | Code Mode (full API context) | FAIL | expected-result:false | Output content did not match the expected answer. | ₦2.78 | 5,694 | results/google_gemini-3.1-flash-lite-preview/scenario-1-code-mode-4bb46306bceb.json |
| 2 | Regular (with progressive discovery) | PASS | passed | passed | ₦0.68 | 868 | results/google_gemini-3.1-flash-lite-preview/scenario-2-regular-f26d70a9c88b.json |
| 2 | Regular (without progressive discovery) | PASS | passed | passed | ₦0.51 | 494 | results/google_gemini-3.1-flash-lite-preview/scenario-2-regular-98d2c569a15f.json |
| 2 | Code Mode (progressive API discovery) | FAIL | tool:api-definition-search; schema:false; expected-result:false | Tool step failed: failed tool group: api-definition-search. Output format did not match the required schema. Output content did not match the expected answer. | ₦2.54 | 5,164 | results/google_gemini-3.1-flash-lite-preview/scenario-2-code-mode-3cb080c89f64-2.json |
| 2 | Code Mode (full API context) | FAIL | schema:false; expected-result:false | Output format did not match the required schema. Output content did not match the expected answer. | ₦2.49 | 5,636 | results/google_gemini-3.1-flash-lite-preview/scenario-2-code-mode-f26d70a9c88b.json |
| 3 | Regular (with progressive discovery) | FAIL | tool:progressive-discovery; schema:false; expected-result:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. Output content did not match the expected answer. | ₦0.79 | 1,350 | results/google_gemini-3.1-flash-lite-preview/scenario-3-regular-292c220117a9.json |
| 3 | Regular (without progressive discovery) | PASS | passed | passed | ₦0.65 | 948 | results/google_gemini-3.1-flash-lite-preview/scenario-3-regular-5f3ff95a4573.json |
| 3 | Code Mode (progressive API discovery) | FAIL | tool:api-definition-search,code-execution; schema:false; expected-result:false | Tool step failed: failed tool group: api-definition-search; did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | ₦3.16 | 6,883 | results/google_gemini-3.1-flash-lite-preview/scenario-3-code-mode-61a2fe1f513b-2.json |
| 3 | Code Mode (full API context) | FAIL | tool:code-execution; schema:false; expected-result:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | ₦1.37 | 2,836 | results/google_gemini-3.1-flash-lite-preview/scenario-3-code-mode-292c220117a9.json |
| 4 | Regular (with progressive discovery) | FAIL | tool:progressive-discovery; schema:false; expected-result:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. Output content did not match the expected answer. | ₦0.64 | 900 | results/google_gemini-3.1-flash-lite-preview/scenario-4-regular-7c8047e9a141.json |
| 4 | Regular (without progressive discovery) | PASS | passed | passed | ₦0.43 | 456 | results/google_gemini-3.1-flash-lite-preview/scenario-4-regular-ccabbc5d6d4b.json |
| 4 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦0.73 | 1,348 | results/google_gemini-3.1-flash-lite-preview/scenario-4-code-mode-3b2542f73b93-3.json |
| 4 | Code Mode (full API context) | FAIL | expected-result:false | Output content did not match the expected answer. | ₦0.34 | 960 | results/google_gemini-3.1-flash-lite-preview/scenario-4-code-mode-7c8047e9a141.json |
| 5 | Regular (with progressive discovery) | FAIL | schema:false; expected-result:false | Output format did not match the required schema. Output content did not match the expected answer. | ₦0.45 | 913 | results/google_gemini-3.1-flash-lite-preview/scenario-5-regular-cf0c788c2d91.json |
| 5 | Regular (without progressive discovery) | PASS | passed | passed | ₦0.41 | 511 | results/google_gemini-3.1-flash-lite-preview/scenario-5-regular-365a66708383.json |
| 5 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦2.18 | 5,334 | results/google_gemini-3.1-flash-lite-preview/scenario-5-code-mode-ee063fcb6a5f.json |
| 5 | Code Mode (full API context) | FAIL | Provider returned error | Provider/network issue prevented a usable model response. | ₦2.23 | 3,792 | results/google_gemini-3.1-flash-lite-preview/scenario-5-code-mode-cf0c788c2d91.json |
| 6 | Regular (with progressive discovery) | FAIL | tool:progressive-discovery; schema:false; expected-result:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. Output content did not match the expected answer. | ₦0.53 | 841 | results/google_gemini-3.1-flash-lite-preview/scenario-6-regular-70b6098dea20.json |
| 6 | Regular (without progressive discovery) | PASS | passed | passed | ₦0.45 | 506 | results/google_gemini-3.1-flash-lite-preview/scenario-6-regular-61c7a75cfb36.json |
| 6 | Code Mode (progressive API discovery) | FAIL | expected-result:false | Output content did not match the expected answer. | ₦0.60 | 1,423 | results/google_gemini-3.1-flash-lite-preview/scenario-6-code-mode-f496763e3e77-3.json |
| 6 | Code Mode (full API context) | PASS | passed | passed | ₦0.39 | 1,098 | results/google_gemini-3.1-flash-lite-preview/scenario-6-code-mode-70b6098dea20.json |

## Run History

| Finished At | Scenario | Paradigm | Outcome | Cost (NGN) | Total Tokens | API Calls | Failure Detail | Failure Reason (Simple) | File |
|---|---:|---|---|---:|---:|---:|---|---|---|
| 2026-04-20T18:45:35.700Z | 5 | Code Mode (progressive API discovery) | PASS | ₦2.18 | 5,334 | 3 | passed | passed | results/google_gemini-3.1-flash-lite-preview/scenario-5-code-mode-ee063fcb6a5f.json |
| 2026-04-20T18:45:30.192Z | 3 | Code Mode (progressive API discovery) | FAIL | ₦1.78 | 3,619 | 2 | Provider returned error | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-flash-lite-preview/scenario-3-code-mode-61a2fe1f513b-3.json |
| 2026-04-20T18:45:22.969Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦2.75 | 5,456 | 3 | tool:api-definition-search,code-execution; schema:false; expected-result:false | Tool step failed: failed tool group: api-definition-search; did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-2-code-mode-3cb080c89f64-3.json |
| 2026-04-20T18:45:21.905Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦0.60 | 1,423 | 1 | expected-result:false | Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-6-code-mode-f496763e3e77-3.json |
| 2026-04-20T18:45:10.903Z | 4 | Code Mode (progressive API discovery) | PASS | ₦0.73 | 1,348 | 1 | passed | passed | results/google_gemini-3.1-flash-lite-preview/scenario-4-code-mode-3b2542f73b93-3.json |
| 2026-04-20T18:44:51.145Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/google_gemini-3.1-flash-lite-preview/scenario-1-code-mode-3932da03d4fb-2.json |
| 2026-04-20T18:40:03.865Z | 5 | Code Mode (progressive API discovery) | FAIL | ₦2.74 | 6,021 | 3 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/google_gemini-3.1-flash-lite-preview/scenario-5-code-mode-cf0c788c2d91-3.json |
| 2026-04-20T18:39:49.572Z | 3 | Code Mode (progressive API discovery) | FAIL | ₦3.16 | 6,883 | 3 | tool:api-definition-search,code-execution; schema:false; expected-result:false | Tool step failed: failed tool group: api-definition-search; did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-3-code-mode-61a2fe1f513b-2.json |
| 2026-04-20T18:39:47.853Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦2.54 | 5,164 | 3 | tool:api-definition-search; schema:false; expected-result:false | Tool step failed: failed tool group: api-definition-search. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-2-code-mode-3cb080c89f64-2.json |
| 2026-04-20T18:39:43.548Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦0.62 | 1,430 | 1 | tool:api-definition-search; expected-result:false | Tool step failed: failed tool group: api-definition-search. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-6-code-mode-f496763e3e77-2.json |
| 2026-04-20T18:39:41.132Z | 4 | Code Mode (progressive API discovery) | FAIL | ₦0.61 | 1,283 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/google_gemini-3.1-flash-lite-preview/scenario-4-code-mode-3b2542f73b93-2.json |
| 2026-04-20T18:39:24.526Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/google_gemini-3.1-flash-lite-preview/scenario-1-code-mode-3932da03d4fb-1.json |
| 2026-04-20T17:48:11.660Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦1.74 | 3,071 | 2 | Provider returned error | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-flash-lite-preview/scenario-6-code-mode-f496763e3e77-1.json |
| 2026-04-20T17:47:48.077Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦0.68 | 994 | 1 | Response failed: {"code":"server_error","message":"internal stream ended unexpectedly"} | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-flash-lite-preview/scenario-6-code-mode-f496763e3e77.json |
| 2026-04-20T17:46:55.514Z | 5 | Code Mode (progressive API discovery) | FAIL | ₦1.13 | 2,694 | 2 | Provider returned error | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-flash-lite-preview/scenario-5-code-mode-cf0c788c2d91-2.json |
| 2026-04-20T17:46:33.950Z | 5 | Code Mode (progressive API discovery) | FAIL | ₦1.10 | 2,764 | 2 | Provider returned error | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-flash-lite-preview/scenario-5-code-mode-cf0c788c2d91-1.json |
| 2026-04-20T17:46:11.062Z | 4 | Code Mode (progressive API discovery) | FAIL | ₦0.63 | 1,086 | 1 | Response failed: {"code":"server_error","message":"internal stream ended unexpectedly"} | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-flash-lite-preview/scenario-4-code-mode-3b2542f73b93-1.json |
| 2026-04-20T17:45:48.623Z | 4 | Code Mode (progressive API discovery) | FAIL | ₦1.41 | 2,821 | 2 | Provider returned error | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-flash-lite-preview/scenario-4-code-mode-3b2542f73b93.json |
| 2026-04-20T17:45:24.045Z | 3 | Code Mode (progressive API discovery) | FAIL | ₦1.70 | 3,365 | 2 | Provider returned error | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-flash-lite-preview/scenario-3-code-mode-61a2fe1f513b-1.json |
| 2026-04-20T17:44:54.143Z | 3 | Code Mode (progressive API discovery) | FAIL | ₦1.45 | 3,127 | 2 | Provider returned error | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-flash-lite-preview/scenario-3-code-mode-61a2fe1f513b.json |
| 2026-04-20T17:44:24.248Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦0.40 | 808 | 1 | Response failed: {"code":"server_error","message":"internal stream ended unexpectedly"} | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-flash-lite-preview/scenario-2-code-mode-3cb080c89f64-1.json |
| 2026-04-20T17:44:01.687Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦1.17 | 2,355 | 2 | Provider returned error | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-flash-lite-preview/scenario-2-code-mode-3cb080c89f64.json |
| 2026-04-20T17:43:06.261Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-13T17:42:58.957Z,2026-04-20T17:42:58.957Z,50000 | Scenario database query failed before the run could be evaluated. | results/google_gemini-3.1-flash-lite-preview/scenario-1-code-mode-3932da03d4fb.json |
| 2026-04-20T16:04:20.755Z | 6 | Regular (without progressive discovery) | PASS | ₦0.45 | 506 | 1 | passed | passed | results/google_gemini-3.1-flash-lite-preview/scenario-6-regular-61c7a75cfb36.json |
| 2026-04-20T16:04:14.123Z | 5 | Regular (without progressive discovery) | PASS | ₦0.41 | 511 | 1 | passed | passed | results/google_gemini-3.1-flash-lite-preview/scenario-5-regular-365a66708383.json |
| 2026-04-20T16:03:57.524Z | 4 | Regular (without progressive discovery) | PASS | ₦0.43 | 456 | 1 | passed | passed | results/google_gemini-3.1-flash-lite-preview/scenario-4-regular-ccabbc5d6d4b.json |
| 2026-04-20T16:03:29.631Z | 3 | Regular (without progressive discovery) | PASS | ₦0.65 | 948 | 1 | passed | passed | results/google_gemini-3.1-flash-lite-preview/scenario-3-regular-5f3ff95a4573.json |
| 2026-04-20T16:03:22.669Z | 2 | Regular (without progressive discovery) | PASS | ₦0.51 | 494 | 1 | passed | passed | results/google_gemini-3.1-flash-lite-preview/scenario-2-regular-98d2c569a15f.json |
| 2026-04-20T16:03:10.247Z | 1 | Regular (without progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-13T16:03:08.009Z,2026-04-20T16:03:08.009Z,50000 | Scenario database query failed before the run could be evaluated. | results/google_gemini-3.1-flash-lite-preview/scenario-1-regular-303c7aaed28d.json |
| 2026-04-20T13:57:32.537Z | 6 | Code Mode (full API context) | PASS | ₦0.39 | 1,098 | 1 | passed | passed | results/google_gemini-3.1-flash-lite-preview/scenario-6-code-mode-70b6098dea20.json |
| 2026-04-20T13:57:23.081Z | 6 | Regular (with progressive discovery) | FAIL | ₦0.53 | 841 | 2 | tool:progressive-discovery; schema:false; expected-result:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-6-regular-70b6098dea20.json |
| 2026-04-20T13:57:10.021Z | 5 | Code Mode (full API context) | FAIL | ₦2.23 | 3,792 | 2 | Provider returned error | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-flash-lite-preview/scenario-5-code-mode-cf0c788c2d91.json |
| 2026-04-20T13:56:51.373Z | 5 | Regular (with progressive discovery) | FAIL | ₦0.45 | 913 | 2 | schema:false; expected-result:false | Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-5-regular-cf0c788c2d91.json |
| 2026-04-20T13:56:27.955Z | 4 | Code Mode (full API context) | FAIL | ₦0.34 | 960 | 1 | expected-result:false | Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-4-code-mode-7c8047e9a141.json |
| 2026-04-20T13:56:19.357Z | 4 | Regular (with progressive discovery) | FAIL | ₦0.64 | 900 | 2 | tool:progressive-discovery; schema:false; expected-result:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-4-regular-7c8047e9a141.json |
| 2026-04-20T13:56:09.359Z | 3 | Code Mode (full API context) | FAIL | ₦1.37 | 2,836 | 3 | tool:code-execution; schema:false; expected-result:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-3-code-mode-292c220117a9.json |
| 2026-04-20T13:55:57.941Z | 3 | Regular (with progressive discovery) | FAIL | ₦0.79 | 1,350 | 2 | tool:progressive-discovery; schema:false; expected-result:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-3-regular-292c220117a9.json |
| 2026-04-20T13:55:50.129Z | 2 | Code Mode (full API context) | FAIL | ₦2.49 | 5,636 | 3 | schema:false; expected-result:false | Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-2-code-mode-f26d70a9c88b.json |
| 2026-04-20T13:55:05.024Z | 2 | Regular (with progressive discovery) | PASS | ₦0.68 | 868 | 2 | passed | passed | results/google_gemini-3.1-flash-lite-preview/scenario-2-regular-f26d70a9c88b.json |
| 2026-04-20T13:54:56.162Z | 1 | Code Mode (full API context) | FAIL | ₦2.78 | 5,694 | 2 | expected-result:false | Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-1-code-mode-4bb46306bceb.json |
| 2026-04-20T13:54:01.036Z | 1 | Regular (with progressive discovery) | FAIL | ₦4.12 | 11,398 | 2 | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-1-regular-4bb46306bceb.json |

