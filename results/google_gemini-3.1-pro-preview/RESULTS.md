# google/gemini-3.1-pro-preview

Official FX conversion in this report uses the official CBN NFEM weighted average rate as at April-20-2026.

## Summary

| Paradigm | Best Passes | Covered Scenarios (max 6) | Best Pass Rate | Recorded Runs | Avg Input Tokens / Run | Avg Output Tokens / Run | Avg Total Tokens / Run | Avg Cost / Run (NGN) | Avg API Calls / Run | Attempts / Covered Scenario | Non-model Fail Runs | Benchmark/Model Fail Runs | Avg Recovery Cost (NGN) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 5/6 | 6/6 | 83.3% | 11 | 7,206 | 717 | 7,923 | ₦38.83 | 2.17 | 1.83 | 0 | 1 | n/a |
| Regular (without progressive discovery) | 5/6 | 6/6 | 83.3% | 7 | 1,604 | 1,115 | 2,720 | ₦27.99 | 1.00 | 1.17 | 0 | 1 | n/a |
| Code Mode (progressive API discovery) | 3/6 | 6/6 | 50.0% | 14 | 635 | 256 | 891 | ₦7.32 | 0.83 | 2.33 | 1 | 2 | ₦39.19 |
| Code Mode (full API context) | 2/6 | 6/6 | 33.3% | 9 | 806 | 1,314 | 2,119 | ₦29.31 | 1.83 | 1.50 | 0 | 4 | n/a |

## Best Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 6 | 83.3% | 7,206 | 717 | 7,923 | ₦38.83 | 2.17 | 19,756 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 83.3% | 1,604 | 1,115 | 2,720 | ₦27.99 | 1.00 | 25,366 ms | 0.00 |
| Code Mode (progressive API discovery) | 5 | 60.0% | 667 | 134 | 801 | ₦4.97 | 0.80 | 24,166 ms | 0.00 |
| Code Mode (full API context) | 6 | 33.3% | 806 | 1,314 | 2,119 | ₦29.31 | 1.83 | 33,514 ms | 1.50 |

## Worst Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 6 | 50.0% | 526 | 535 | 1,061 | ₦12.60 | 1.33 | 18,391 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 83.3% | 1,604 | 1,115 | 2,720 | ₦27.99 | 1.00 | 25,366 ms | 0.00 |
| Code Mode (progressive API discovery) | 5 | 20.0% | 1,135 | 724 | 1,859 | ₦18.48 | 1.60 | 40,065 ms | 1.20 |
| Code Mode (full API context) | 6 | 33.3% | 951 | 1,745 | 2,695 | ₦38.53 | 2.33 | 29,989 ms | 2.00 |

## Average Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 8 | 62.5% | 5,405 | 538 | 5,942 | ₦29.12 | 1.63 | 19,756 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 83.3% | 1,604 | 1,115 | 2,720 | ₦27.99 | 1.00 | 25,366 ms | 0.00 |
| Code Mode (progressive API discovery) | 10 | 30.0% | 823 | 409 | 1,231 | ₦11.05 | 1.10 | 31,670 ms | 0.60 |
| Code Mode (full API context) | 7 | 28.6% | 815 | 1,495 | 2,310 | ₦33.02 | 2.00 | 29,989 ms | 1.71 |

## Recovery Benchmarks

Lower is better for retries, cost, and time.

| Paradigm | Recovered Cases | Avg Retries To Recover | Avg Recovery Cost (NGN) | Avg Recovery Time |
|---|---:|---:|---:|---:|
| Regular (with progressive discovery) | 0 | n/a | n/a | n/a |
| Regular (without progressive discovery) | 0 | n/a | n/a | n/a |
| Code Mode (progressive API discovery) | 2 | 1.00 | ₦39.19 | 4,031,335 ms |
| Code Mode (full API context) | 0 | n/a | n/a | n/a |

## Failure Analysis (All Recorded Rounds)

Total rounds: **46**
Failed rounds: **31**

| Paradigm | Recorded Rounds | Failed Rounds | Failure Rate | Non-model Failures | Benchmark/Model Failures |
|---|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 11 | 6 | 54.5% | 3 | 3 |
| Regular (without progressive discovery) | 7 | 2 | 28.6% | 1 | 1 |
| Code Mode (progressive API discovery) | 19 | 16 | 84.2% | 4 | 12 |
| Code Mode (full API context) | 9 | 7 | 77.8% | 2 | 5 |

| Failure Reason | Count | Scenarios | Paradigms | Human-readable reason | Latest Example File |
|---|---:|---|---|---|---|
| tool:api-definition-search | 5 | 2,3,4,6 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search. | results/google_gemini-3.1-pro-preview/scenario-3-code-mode-e741a009f8e9-1.json |
| Provider returned error | 4 | 5 | Code Mode (progressive API discovery) | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-5-code-mode-1bca1732ddeb-3.json |
| No transactions found in the last 7 days. Run the seed script first. | 3 | 1 | Code Mode (progressive API discovery) | Run failed due to benchmark/model mismatch. | results/google_gemini-3.1-pro-preview/scenario-1-code-mode-abc86a6de3ed-2.json |
| Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | 3 | 4,5 | Regular (without progressive discovery), Code Mode (full API context) | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-4-regular-2fb7a75d5461.json |
| tool:code-execution; schema:false | 3 | 2,5,6 | Code Mode (full API context) | Tool step failed: did not execute the required code tool. Output format did not match the required schema. | results/google_gemini-3.1-pro-preview/scenario-5-code-mode-7f31b9bb3c9d-1.json |
| Response failed: {"code":"server_error","message":"internal stream ended unexpectedly"} | 3 | 2,5 | Regular (with progressive discovery) | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-5-regular-7f31b9bb3c9d-1.json |
| tool:api-definition-search; schema:false; expected-result:false | 2 | 3,4 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-pro-preview/scenario-4-code-mode-c9dbbe596715.json |
| expected-result:false | 1 | 6 | Code Mode (progressive API discovery) | Output content did not match the expected answer. | results/google_gemini-3.1-pro-preview/scenario-6-code-mode-37eae52b542f-2.json |
| tool:api-definition-search; expected-result:false | 1 | 6 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search. Output content did not match the expected answer. | results/google_gemini-3.1-pro-preview/scenario-6-code-mode-37eae52b542f-1.json |
| tool:customer-source,transaction-window,stats; expected-result:false | 1 | 1 | Regular (without progressive discovery) | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/google_gemini-3.1-pro-preview/scenario-1-regular-1fc60e21329f.json |
| Unable to make request: Error: The socket connection was closed unexpectedly. For more information, pass `verbose: true` in the second argument to fetch() | 1 | 6 | Regular (with progressive discovery) | Run failed due to benchmark/model mismatch. | results/google_gemini-3.1-pro-preview/scenario-6-regular-9dd9d6d2032e.json |
| tool:channel-summary; schema:false | 1 | 3 | Regular (with progressive discovery) | Tool step failed: did not summarize the Slack channel correctly. Output format did not match the required schema. | results/google_gemini-3.1-pro-preview/scenario-3-regular-876ef938025f.json |
| tool:code-execution; expected-result:false | 1 | 1 | Code Mode (full API context) | Tool step failed: did not execute the required code tool. Output content did not match the expected answer. | results/google_gemini-3.1-pro-preview/scenario-1-code-mode-8b9a120be232-1.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:29:05.025Z,2026-04-14T18:29:05.025Z,50000 | 1 | 1 | Code Mode (full API context) | Scenario database query failed before the run could be evaluated. | results/google_gemini-3.1-pro-preview/scenario-1-code-mode-8b9a120be232.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:29:01.031Z,2026-04-14T18:29:01.031Z,50000 | 1 | 1 | Regular (with progressive discovery) | Scenario database query failed before the run could be evaluated. | results/google_gemini-3.1-pro-preview/scenario-1-regular-8b9a120be232.json |

## Best Historical Scenario Outcomes

| Scenario | Paradigm | Best Outcome | Failure Detail | Failure Reason (Simple) | Representative Cost (NGN) | Representative Tokens | Representative File |
|---|---|---|---|---|---:|---:|---|
| 1 | Regular (with progressive discovery) | PASS | passed | passed | ₦142.94 | 39,794 | results/google_gemini-3.1-pro-preview/scenario-1-regular-8b9a120be232-1.json |
| 1 | Regular (without progressive discovery) | FAIL | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | ₦92.80 | 10,837 | results/google_gemini-3.1-pro-preview/scenario-1-regular-1fc60e21329f.json |
| 1 | Code Mode (progressive API discovery) | FAIL | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | ₦0.00 | 0 | results/google_gemini-3.1-pro-preview/scenario-1-code-mode-abc86a6de3ed-2.json |
| 1 | Code Mode (full API context) | FAIL | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:29:05.025Z,2026-04-14T18:29:05.025Z,50000 | Scenario database query failed before the run could be evaluated. | ₦0.00 | 0 | results/google_gemini-3.1-pro-preview/scenario-1-code-mode-8b9a120be232.json |
| 2 | Regular (with progressive discovery) | PASS | passed | passed | ₦17.47 | 1,443 | results/google_gemini-3.1-pro-preview/scenario-2-regular-d5f33071c10e-1.json |
| 2 | Regular (without progressive discovery) | PASS | passed | passed | ₦13.47 | 891 | results/google_gemini-3.1-pro-preview/scenario-2-regular-59ead3374656.json |
| 2 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦6.78 | 988 | results/google_gemini-3.1-pro-preview/scenario-2-code-mode-feb503ab08e1-2.json |
| 2 | Code Mode (full API context) | FAIL | tool:code-execution; schema:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. | ₦56.89 | 3,896 | results/google_gemini-3.1-pro-preview/scenario-2-code-mode-d5f33071c10e.json |
| 3 | Regular (with progressive discovery) | FAIL | tool:channel-summary; schema:false | Tool step failed: did not summarize the Slack channel correctly. Output format did not match the required schema. | ₦28.08 | 2,087 | results/google_gemini-3.1-pro-preview/scenario-3-regular-876ef938025f.json |
| 3 | Regular (without progressive discovery) | PASS | passed | passed | ₦18.89 | 1,618 | results/google_gemini-3.1-pro-preview/scenario-3-regular-d7761acce382.json |
| 3 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦5.23 | 970 | results/google_gemini-3.1-pro-preview/scenario-3-code-mode-e741a009f8e9-2.json |
| 3 | Code Mode (full API context) | PASS | passed | passed | ₦4.94 | 1,268 | results/google_gemini-3.1-pro-preview/scenario-3-code-mode-876ef938025f.json |
| 4 | Regular (with progressive discovery) | PASS | passed | passed | ₦12.23 | 1,244 | results/google_gemini-3.1-pro-preview/scenario-4-regular-c351e31b64c3.json |
| 4 | Regular (without progressive discovery) | PASS | passed | passed | ₦14.09 | 915 | results/google_gemini-3.1-pro-preview/scenario-4-regular-e6da09840582.json |
| 4 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦6.24 | 1,080 | results/google_gemini-3.1-pro-preview/scenario-4-code-mode-c9dbbe596715-2.json |
| 4 | Code Mode (full API context) | PASS | passed | passed | ₦3.37 | 643 | results/google_gemini-3.1-pro-preview/scenario-4-code-mode-c351e31b64c3-1.json |
| 5 | Regular (with progressive discovery) | PASS | passed | passed | ₦17.83 | 1,590 | results/google_gemini-3.1-pro-preview/scenario-5-regular-7f31b9bb3c9d.json |
| 5 | Regular (without progressive discovery) | PASS | passed | passed | ₦14.61 | 1,005 | results/google_gemini-3.1-pro-preview/scenario-5-regular-dfca9c55d140.json |
| 5 | Code Mode (progressive API discovery) | FAIL | Provider returned error | Provider/network issue prevented a usable model response. | ₦19.06 | 1,338 | results/google_gemini-3.1-pro-preview/scenario-5-code-mode-1bca1732ddeb.json |
| 5 | Code Mode (full API context) | FAIL | tool:code-execution; schema:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. | ₦53.72 | 3,012 | results/google_gemini-3.1-pro-preview/scenario-5-code-mode-7f31b9bb3c9d-1.json |
| 6 | Regular (with progressive discovery) | PASS | passed | passed | ₦14.43 | 1,381 | results/google_gemini-3.1-pro-preview/scenario-6-regular-9dd9d6d2032e-1.json |
| 6 | Regular (without progressive discovery) | PASS | passed | passed | ₦14.11 | 1,051 | results/google_gemini-3.1-pro-preview/scenario-6-regular-d616b011d86c.json |
| 6 | Code Mode (progressive API discovery) | FAIL | tool:api-definition-search; expected-result:false | Tool step failed: failed tool group: api-definition-search. Output content did not match the expected answer. | ₦6.61 | 968 | results/google_gemini-3.1-pro-preview/scenario-6-code-mode-37eae52b542f-1.json |
| 6 | Code Mode (full API context) | FAIL | tool:code-execution; schema:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. | ₦56.94 | 3,895 | results/google_gemini-3.1-pro-preview/scenario-6-code-mode-9dd9d6d2032e.json |

## Run History

| Finished At | Scenario | Paradigm | Outcome | Cost (NGN) | Total Tokens | API Calls | Failure Detail | Failure Reason (Simple) | File |
|---|---:|---|---|---:|---:|---:|---|---|---|
| 2026-04-20T18:45:30.843Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦7.27 | 1,168 | 1 | expected-result:false | Output content did not match the expected answer. | results/google_gemini-3.1-pro-preview/scenario-6-code-mode-37eae52b542f-2.json |
| 2026-04-20T18:45:15.865Z | 5 | Code Mode (progressive API discovery) | FAIL | ₦23.14 | 2,519 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-5-code-mode-1bca1732ddeb-3.json |
| 2026-04-20T18:45:15.797Z | 2 | Code Mode (progressive API discovery) | PASS | ₦6.78 | 988 | 1 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-2-code-mode-feb503ab08e1-2.json |
| 2026-04-20T18:45:09.620Z | 4 | Code Mode (progressive API discovery) | PASS | ₦6.24 | 1,080 | 1 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-4-code-mode-c9dbbe596715-2.json |
| 2026-04-20T18:45:00.058Z | 3 | Code Mode (progressive API discovery) | PASS | ₦5.23 | 970 | 1 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-3-code-mode-e741a009f8e9-2.json |
| 2026-04-20T18:44:41.926Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/google_gemini-3.1-pro-preview/scenario-1-code-mode-abc86a6de3ed-2.json |
| 2026-04-20T18:39:50.354Z | 5 | Code Mode (progressive API discovery) | FAIL | ₦19.60 | 1,509 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-5-code-mode-1bca1732ddeb-2.json |
| 2026-04-20T18:39:44.591Z | 3 | Code Mode (progressive API discovery) | FAIL | ₦6.56 | 1,034 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/google_gemini-3.1-pro-preview/scenario-3-code-mode-e741a009f8e9-1.json |
| 2026-04-20T18:39:39.473Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦6.61 | 968 | 1 | tool:api-definition-search; expected-result:false | Tool step failed: failed tool group: api-definition-search. Output content did not match the expected answer. | results/google_gemini-3.1-pro-preview/scenario-6-code-mode-37eae52b542f-1.json |
| 2026-04-20T18:39:30.848Z | 4 | Code Mode (progressive API discovery) | FAIL | ₦5.69 | 901 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/google_gemini-3.1-pro-preview/scenario-4-code-mode-c9dbbe596715-1.json |
| 2026-04-20T18:39:30.550Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦6.98 | 999 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/google_gemini-3.1-pro-preview/scenario-2-code-mode-feb503ab08e1-1.json |
| 2026-04-20T18:39:16.936Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/google_gemini-3.1-pro-preview/scenario-1-code-mode-abc86a6de3ed-1.json |
| 2026-04-20T17:42:56.813Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦45.59 | 4,385 | 3 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/google_gemini-3.1-pro-preview/scenario-6-code-mode-37eae52b542f.json |
| 2026-04-20T17:41:40.812Z | 5 | Code Mode (progressive API discovery) | FAIL | ₦19.06 | 1,339 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-5-code-mode-1bca1732ddeb-1.json |
| 2026-04-20T17:41:22.279Z | 5 | Code Mode (progressive API discovery) | FAIL | ₦19.06 | 1,338 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-5-code-mode-1bca1732ddeb.json |
| 2026-04-20T17:40:34.046Z | 4 | Code Mode (progressive API discovery) | FAIL | ₦49.89 | 4,070 | 3 | tool:api-definition-search; schema:false; expected-result:false | Tool step failed: failed tool group: api-definition-search. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-pro-preview/scenario-4-code-mode-c9dbbe596715.json |
| 2026-04-20T17:39:19.352Z | 3 | Code Mode (progressive API discovery) | FAIL | ₦28.49 | 3,070 | 3 | tool:api-definition-search; schema:false; expected-result:false | Tool step failed: failed tool group: api-definition-search. Output format did not match the required schema. Output content did not match the expected answer. | results/google_gemini-3.1-pro-preview/scenario-3-code-mode-e741a009f8e9.json |
| 2026-04-20T17:36:23.242Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦35.94 | 3,830 | 3 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/google_gemini-3.1-pro-preview/scenario-2-code-mode-feb503ab08e1.json |
| 2026-04-20T17:35:08.520Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/google_gemini-3.1-pro-preview/scenario-1-code-mode-abc86a6de3ed.json |
| 2026-04-20T16:03:06.066Z | 6 | Regular (without progressive discovery) | PASS | ₦14.11 | 1,051 | 1 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-6-regular-d616b011d86c.json |
| 2026-04-20T16:02:41.438Z | 5 | Regular (without progressive discovery) | PASS | ₦14.61 | 1,005 | 1 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-5-regular-dfca9c55d140.json |
| 2026-04-20T16:02:21.633Z | 4 | Regular (without progressive discovery) | PASS | ₦14.09 | 915 | 1 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-4-regular-e6da09840582.json |
| 2026-04-20T16:02:04.202Z | 4 | Regular (without progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-4-regular-2fb7a75d5461.json |
| 2026-04-20T14:57:14.051Z | 3 | Regular (without progressive discovery) | PASS | ₦18.89 | 1,618 | 1 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-3-regular-d7761acce382.json |
| 2026-04-20T14:56:41.175Z | 2 | Regular (without progressive discovery) | PASS | ₦13.47 | 891 | 1 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-2-regular-59ead3374656.json |
| 2026-04-20T14:56:23.555Z | 1 | Regular (without progressive discovery) | FAIL | ₦92.80 | 10,837 | 1 | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/google_gemini-3.1-pro-preview/scenario-1-regular-1fc60e21329f.json |
| 2026-04-15T22:43:56.490Z | 6 | Regular (with progressive discovery) | PASS | ₦14.43 | 1,381 | 2 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-6-regular-9dd9d6d2032e-1.json |
| 2026-04-15T22:43:33.501Z | 5 | Code Mode (full API context) | FAIL | ₦53.72 | 3,012 | 3 | tool:code-execution; schema:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. | results/google_gemini-3.1-pro-preview/scenario-5-code-mode-7f31b9bb3c9d-1.json |
| 2026-04-15T22:42:43.031Z | 5 | Regular (with progressive discovery) | PASS | ₦17.83 | 1,590 | 2 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-5-regular-7f31b9bb3c9d.json |
| 2026-04-15T22:42:09.848Z | 4 | Code Mode (full API context) | PASS | ₦3.37 | 643 | 1 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-4-code-mode-c351e31b64c3-1.json |
| 2026-04-15T22:41:00.076Z | 2 | Regular (with progressive discovery) | PASS | ₦17.47 | 1,443 | 2 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-2-regular-d5f33071c10e-1.json |
| 2026-04-15T15:48:47.664Z | 6 | Code Mode (full API context) | FAIL | ₦56.94 | 3,895 | 3 | tool:code-execution; schema:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. | results/google_gemini-3.1-pro-preview/scenario-6-code-mode-9dd9d6d2032e.json |
| 2026-04-15T15:47:14.797Z | 6 | Regular (with progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Unable to make request: Error: The socket connection was closed unexpectedly. For more information, pass `verbose: true` in the second argument to fetch() | Run failed due to benchmark/model mismatch. | results/google_gemini-3.1-pro-preview/scenario-6-regular-9dd9d6d2032e.json |
| 2026-04-15T15:46:49.277Z | 5 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-5-code-mode-7f31b9bb3c9d.json |
| 2026-04-15T15:46:28.639Z | 5 | Regular (with progressive discovery) | FAIL | ₦4.08 | 524 | 1 | Response failed: {"code":"server_error","message":"internal stream ended unexpectedly"} | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-5-regular-7f31b9bb3c9d-1.json |
| 2026-04-15T15:45:35.741Z | 4 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-4-code-mode-c351e31b64c3.json |
| 2026-04-15T15:45:14.596Z | 2 | Regular (with progressive discovery) | FAIL | ₦3.35 | 539 | 1 | Response failed: {"code":"server_error","message":"internal stream ended unexpectedly"} | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-2-regular-d5f33071c10e-2.json |
| 2026-04-14T18:35:05.841Z | 4 | Regular (with progressive discovery) | PASS | ₦12.23 | 1,244 | 2 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-4-regular-c351e31b64c3.json |
| 2026-04-14T18:34:22.549Z | 3 | Code Mode (full API context) | PASS | ₦4.94 | 1,268 | 1 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-3-code-mode-876ef938025f.json |
| 2026-04-14T18:33:46.287Z | 3 | Regular (with progressive discovery) | FAIL | ₦28.08 | 2,087 | 2 | tool:channel-summary; schema:false | Tool step failed: did not summarize the Slack channel correctly. Output format did not match the required schema. | results/google_gemini-3.1-pro-preview/scenario-3-regular-876ef938025f.json |
| 2026-04-14T18:33:01.834Z | 2 | Code Mode (full API context) | FAIL | ₦56.89 | 3,896 | 3 | tool:code-execution; schema:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. | results/google_gemini-3.1-pro-preview/scenario-2-code-mode-d5f33071c10e.json |
| 2026-04-14T18:32:09.466Z | 2 | Regular (with progressive discovery) | FAIL | ₦3.46 | 441 | 1 | Response failed: {"code":"server_error","message":"internal stream ended unexpectedly"} | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-2-regular-d5f33071c10e.json |
| 2026-04-14T18:31:34.683Z | 1 | Code Mode (full API context) | FAIL | ₦55.31 | 3,457 | 3 | tool:code-execution; expected-result:false | Tool step failed: did not execute the required code tool. Output content did not match the expected answer. | results/google_gemini-3.1-pro-preview/scenario-1-code-mode-8b9a120be232-1.json |
| 2026-04-14T18:30:55.279Z | 1 | Regular (with progressive discovery) | PASS | ₦142.94 | 39,794 | 3 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-1-regular-8b9a120be232-1.json |
| 2026-04-14T18:29:05.916Z | 1 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:29:05.025Z,2026-04-14T18:29:05.025Z,50000 | Scenario database query failed before the run could be evaluated. | results/google_gemini-3.1-pro-preview/scenario-1-code-mode-8b9a120be232.json |
| 2026-04-14T18:29:02.984Z | 1 | Regular (with progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:29:01.031Z,2026-04-14T18:29:01.031Z,50000 | Scenario database query failed before the run could be evaluated. | results/google_gemini-3.1-pro-preview/scenario-1-regular-8b9a120be232.json |

