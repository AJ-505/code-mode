# google/gemini-3.1-flash-lite-preview

Official FX conversion in this report uses the official CBN NFEM weighted average rate as at April-20-2026.

## Summary

| Paradigm | Best Passes | Covered Scenarios (max 6) | Best Pass Rate | Recorded Runs | Avg Input Tokens / Run | Avg Output Tokens / Run | Avg Total Tokens / Run | Avg Cost / Run (NGN) | Avg API Calls / Run | Attempts / Covered Scenario | Non-model Fail Runs | Benchmark/Model Fail Runs | Avg Recovery Cost (NGN) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 1/6 | 6/6 | 16.7% | 6 | 2,542 | 170 | 2,712 | ₦1.20 | 2.00 | 1.00 | 0 | 5 | n/a |
| Regular (without progressive discovery) | 5/6 | 6/6 | 83.3% | 6 | 341 | 145 | 486 | ₦0.41 | 0.83 | 1.00 | 0 | 1 | n/a |
| Code Mode | 1/6 | 6/6 | 16.7% | 6 | 3,055 | 281 | 3,336 | ₦1.60 | 2.00 | 1.00 | 1 | 4 | n/a |

## Failure Analysis (All Recorded Rounds)

Total rounds: **18**
Failed rounds: **11**

| Paradigm | Recorded Rounds | Failed Rounds | Failure Rate | Non-model Failures | Benchmark/Model Failures |
|---|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 6 | 5 | 83.3% | 0 | 5 |
| Regular (without progressive discovery) | 6 | 1 | 16.7% | 0 | 1 |
| Code Mode | 6 | 5 | 83.3% | 1 | 4 |

| Failure Reason | Count | Scenarios | Paradigms | Human-readable reason | Latest Example File |
|---|---:|---|---|---|---|
| tool:progressive-discovery; schema:false; expected-result:false | 3 | 3,4,6 | Regular (with progressive discovery) | Tool step failed: did not discover required tools first. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-6-regular-70b6098dea20.json |
| schema:false; expected-result:false | 2 | 2,5 | Regular (with progressive discovery), Code Mode | Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-5-regular-cf0c788c2d91.json |
| expected-result:false | 2 | 1,4 | Code Mode | Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-4-code-mode-7c8047e9a141.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-13T16:03:08.009Z,2026-04-20T16:03:08.009Z,50000 | 1 | 1 | Regular (without progressive discovery) | Scenario database query failed before the run could be evaluated. | results/google_gemini-3.1-flash-lite-preview/scenario-1-regular-303c7aaed28d.json |
| Provider returned error | 1 | 5 | Code Mode | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-flash-lite-preview/scenario-5-code-mode-cf0c788c2d91.json |
| tool:code-execution; schema:false; expected-result:false | 1 | 3 | Code Mode | Tool step failed: did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-3-code-mode-292c220117a9.json |
| tool:customer-source,transaction-window,stats; expected-result:false | 1 | 1 | Regular (with progressive discovery) | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-1-regular-4bb46306bceb.json |

## Best Historical Scenario Outcomes

| Scenario | Paradigm | Best Outcome | Failure Detail | Failure Reason (Simple) | Representative Cost (NGN) | Representative Tokens | Representative File |
|---|---|---|---|---|---:|---:|---|
| 1 | Regular (with progressive discovery) | FAIL | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | ₦4.12 | 11,398 | results/google_gemini-3.1-flash-lite-preview/scenario-1-regular-4bb46306bceb.json |
| 1 | Regular (without progressive discovery) | FAIL | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-13T16:03:08.009Z,2026-04-20T16:03:08.009Z,50000 | Scenario database query failed before the run could be evaluated. | ₦0.00 | 0 | results/google_gemini-3.1-flash-lite-preview/scenario-1-regular-303c7aaed28d.json |
| 1 | Code Mode | FAIL | expected-result:false | Output content did not match the expected answer. | ₦2.78 | 5,694 | results/google_gemini-3.1-flash-lite-preview/scenario-1-code-mode-4bb46306bceb.json |
| 2 | Regular (with progressive discovery) | PASS | passed | passed | ₦0.68 | 868 | results/google_gemini-3.1-flash-lite-preview/scenario-2-regular-f26d70a9c88b.json |
| 2 | Regular (without progressive discovery) | PASS | passed | passed | ₦0.51 | 494 | results/google_gemini-3.1-flash-lite-preview/scenario-2-regular-98d2c569a15f.json |
| 2 | Code Mode | FAIL | schema:false; expected-result:false | Output format did not match the required schema. Output content did not match the expected answer. | ₦2.49 | 5,636 | results/google_gemini-3.1-flash-lite-preview/scenario-2-code-mode-f26d70a9c88b.json |
| 3 | Regular (with progressive discovery) | FAIL | tool:progressive-discovery; schema:false; expected-result:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. Output content did not match the expected answer. | ₦0.79 | 1,350 | results/google_gemini-3.1-flash-lite-preview/scenario-3-regular-292c220117a9.json |
| 3 | Regular (without progressive discovery) | PASS | passed | passed | ₦0.65 | 948 | results/google_gemini-3.1-flash-lite-preview/scenario-3-regular-5f3ff95a4573.json |
| 3 | Code Mode | FAIL | tool:code-execution; schema:false; expected-result:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | ₦1.37 | 2,836 | results/google_gemini-3.1-flash-lite-preview/scenario-3-code-mode-292c220117a9.json |
| 4 | Regular (with progressive discovery) | FAIL | tool:progressive-discovery; schema:false; expected-result:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. Output content did not match the expected answer. | ₦0.64 | 900 | results/google_gemini-3.1-flash-lite-preview/scenario-4-regular-7c8047e9a141.json |
| 4 | Regular (without progressive discovery) | PASS | passed | passed | ₦0.43 | 456 | results/google_gemini-3.1-flash-lite-preview/scenario-4-regular-ccabbc5d6d4b.json |
| 4 | Code Mode | FAIL | expected-result:false | Output content did not match the expected answer. | ₦0.34 | 960 | results/google_gemini-3.1-flash-lite-preview/scenario-4-code-mode-7c8047e9a141.json |
| 5 | Regular (with progressive discovery) | FAIL | schema:false; expected-result:false | Output format did not match the required schema. Output content did not match the expected answer. | ₦0.45 | 913 | results/google_gemini-3.1-flash-lite-preview/scenario-5-regular-cf0c788c2d91.json |
| 5 | Regular (without progressive discovery) | PASS | passed | passed | ₦0.41 | 511 | results/google_gemini-3.1-flash-lite-preview/scenario-5-regular-365a66708383.json |
| 5 | Code Mode | FAIL | Provider returned error | Provider/network issue prevented a usable model response. | ₦2.23 | 3,792 | results/google_gemini-3.1-flash-lite-preview/scenario-5-code-mode-cf0c788c2d91.json |
| 6 | Regular (with progressive discovery) | FAIL | tool:progressive-discovery; schema:false; expected-result:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. Output content did not match the expected answer. | ₦0.53 | 841 | results/google_gemini-3.1-flash-lite-preview/scenario-6-regular-70b6098dea20.json |
| 6 | Regular (without progressive discovery) | PASS | passed | passed | ₦0.45 | 506 | results/google_gemini-3.1-flash-lite-preview/scenario-6-regular-61c7a75cfb36.json |
| 6 | Code Mode | PASS | passed | passed | ₦0.39 | 1,098 | results/google_gemini-3.1-flash-lite-preview/scenario-6-code-mode-70b6098dea20.json |

## Run History

| Finished At | Scenario | Paradigm | Outcome | Cost (NGN) | Total Tokens | API Calls | Failure Detail | Failure Reason (Simple) | File |
|---|---:|---|---|---:|---:|---:|---|---|---|
| 2026-04-20T16:04:20.755Z | 6 | Regular (without progressive discovery) | PASS | ₦0.45 | 506 | 1 | passed | passed | results/google_gemini-3.1-flash-lite-preview/scenario-6-regular-61c7a75cfb36.json |
| 2026-04-20T16:04:14.123Z | 5 | Regular (without progressive discovery) | PASS | ₦0.41 | 511 | 1 | passed | passed | results/google_gemini-3.1-flash-lite-preview/scenario-5-regular-365a66708383.json |
| 2026-04-20T16:03:57.524Z | 4 | Regular (without progressive discovery) | PASS | ₦0.43 | 456 | 1 | passed | passed | results/google_gemini-3.1-flash-lite-preview/scenario-4-regular-ccabbc5d6d4b.json |
| 2026-04-20T16:03:29.631Z | 3 | Regular (without progressive discovery) | PASS | ₦0.65 | 948 | 1 | passed | passed | results/google_gemini-3.1-flash-lite-preview/scenario-3-regular-5f3ff95a4573.json |
| 2026-04-20T16:03:22.669Z | 2 | Regular (without progressive discovery) | PASS | ₦0.51 | 494 | 1 | passed | passed | results/google_gemini-3.1-flash-lite-preview/scenario-2-regular-98d2c569a15f.json |
| 2026-04-20T16:03:10.247Z | 1 | Regular (without progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-13T16:03:08.009Z,2026-04-20T16:03:08.009Z,50000 | Scenario database query failed before the run could be evaluated. | results/google_gemini-3.1-flash-lite-preview/scenario-1-regular-303c7aaed28d.json |
| 2026-04-20T13:57:32.537Z | 6 | Code Mode | PASS | ₦0.39 | 1,098 | 1 | passed | passed | results/google_gemini-3.1-flash-lite-preview/scenario-6-code-mode-70b6098dea20.json |
| 2026-04-20T13:57:23.081Z | 6 | Regular (with progressive discovery) | FAIL | ₦0.53 | 841 | 2 | tool:progressive-discovery; schema:false; expected-result:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-6-regular-70b6098dea20.json |
| 2026-04-20T13:57:10.021Z | 5 | Code Mode | FAIL | ₦2.23 | 3,792 | 2 | Provider returned error | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-flash-lite-preview/scenario-5-code-mode-cf0c788c2d91.json |
| 2026-04-20T13:56:51.373Z | 5 | Regular (with progressive discovery) | FAIL | ₦0.45 | 913 | 2 | schema:false; expected-result:false | Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-5-regular-cf0c788c2d91.json |
| 2026-04-20T13:56:27.955Z | 4 | Code Mode | FAIL | ₦0.34 | 960 | 1 | expected-result:false | Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-4-code-mode-7c8047e9a141.json |
| 2026-04-20T13:56:19.357Z | 4 | Regular (with progressive discovery) | FAIL | ₦0.64 | 900 | 2 | tool:progressive-discovery; schema:false; expected-result:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-4-regular-7c8047e9a141.json |
| 2026-04-20T13:56:09.359Z | 3 | Code Mode | FAIL | ₦1.37 | 2,836 | 3 | tool:code-execution; schema:false; expected-result:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-3-code-mode-292c220117a9.json |
| 2026-04-20T13:55:57.941Z | 3 | Regular (with progressive discovery) | FAIL | ₦0.79 | 1,350 | 2 | tool:progressive-discovery; schema:false; expected-result:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-3-regular-292c220117a9.json |
| 2026-04-20T13:55:50.129Z | 2 | Code Mode | FAIL | ₦2.49 | 5,636 | 3 | schema:false; expected-result:false | Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-2-code-mode-f26d70a9c88b.json |
| 2026-04-20T13:55:05.024Z | 2 | Regular (with progressive discovery) | PASS | ₦0.68 | 868 | 2 | passed | passed | results/google_gemini-3.1-flash-lite-preview/scenario-2-regular-f26d70a9c88b.json |
| 2026-04-20T13:54:56.162Z | 1 | Code Mode | FAIL | ₦2.78 | 5,694 | 2 | expected-result:false | Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-1-code-mode-4bb46306bceb.json |
| 2026-04-20T13:54:01.036Z | 1 | Regular (with progressive discovery) | FAIL | ₦4.12 | 11,398 | 2 | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/google_gemini-3.1-flash-lite-preview/scenario-1-regular-4bb46306bceb.json |

