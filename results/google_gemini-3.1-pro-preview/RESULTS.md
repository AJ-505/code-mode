# google/gemini-3.1-pro-preview

Official FX conversion in this report uses the official CBN NFEM weighted average rate as at April-20-2026.

## Summary

| Paradigm | Best Passes | Covered Scenarios (max 6) | Best Pass Rate | Recorded Runs | Avg Input Tokens / Run | Avg Output Tokens / Run | Avg Total Tokens / Run | Avg Cost / Run (NGN) | Avg API Calls / Run | Attempts / Covered Scenario | Non-model Fail Runs | Benchmark/Model Fail Runs | Avg Recovery Cost (NGN) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 5/6 | 6/6 | 83.3% | 11 | 7,206 | 717 | 7,923 | ₦38.83 | 2.17 | 1.83 | 0 | 1 | ₦5.45 |
| Regular (without progressive discovery) | 5/6 | 6/6 | 83.3% | 7 | 1,604 | 1,115 | 2,720 | ₦27.99 | 1.00 | 1.17 | 0 | 1 | n/a |
| Code Mode | 2/6 | 6/6 | 33.3% | 9 | 806 | 1,314 | 2,119 | ₦29.31 | 1.83 | 1.50 | 0 | 4 | n/a |

## Failure Analysis (All Recorded Rounds)

Total rounds: **27**
Failed rounds: **15**

| Paradigm | Recorded Rounds | Failed Rounds | Failure Rate | Non-model Failures | Benchmark/Model Failures |
|---|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 11 | 6 | 54.5% | 3 | 3 |
| Regular (without progressive discovery) | 7 | 2 | 28.6% | 1 | 1 |
| Code Mode | 9 | 7 | 77.8% | 2 | 5 |

| Failure Reason | Count | Scenarios | Paradigms | Human-readable reason | Latest Example File |
|---|---:|---|---|---|---|
| Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | 3 | 4,5 | Regular (without progressive discovery), Code Mode | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-4-regular-2fb7a75d5461.json |
| tool:code-execution; schema:false | 3 | 2,5,6 | Code Mode | Tool step failed: did not execute the required code tool. Output format did not match the required schema. | results/google_gemini-3.1-pro-preview/scenario-5-code-mode-7f31b9bb3c9d-1.json |
| Response failed: {"code":"server_error","message":"internal stream ended unexpectedly"} | 3 | 2,5 | Regular (with progressive discovery) | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-5-regular-7f31b9bb3c9d-1.json |
| tool:customer-source,transaction-window,stats; expected-result:false | 1 | 1 | Regular (without progressive discovery) | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/google_gemini-3.1-pro-preview/scenario-1-regular-1fc60e21329f.json |
| Unable to make request: Error: The socket connection was closed unexpectedly. For more information, pass `verbose: true` in the second argument to fetch() | 1 | 6 | Regular (with progressive discovery) | Run failed due to benchmark/model mismatch. | results/google_gemini-3.1-pro-preview/scenario-6-regular-9dd9d6d2032e.json |
| tool:channel-summary; schema:false | 1 | 3 | Regular (with progressive discovery) | Tool step failed: did not summarize the Slack channel correctly. Output format did not match the required schema. | results/google_gemini-3.1-pro-preview/scenario-3-regular-876ef938025f.json |
| tool:code-execution; expected-result:false | 1 | 1 | Code Mode | Tool step failed: did not execute the required code tool. Output content did not match the expected answer. | results/google_gemini-3.1-pro-preview/scenario-1-code-mode-8b9a120be232-1.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:29:05.025Z,2026-04-14T18:29:05.025Z,50000 | 1 | 1 | Code Mode | Scenario database query failed before the run could be evaluated. | results/google_gemini-3.1-pro-preview/scenario-1-code-mode-8b9a120be232.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:29:01.031Z,2026-04-14T18:29:01.031Z,50000 | 1 | 1 | Regular (with progressive discovery) | Scenario database query failed before the run could be evaluated. | results/google_gemini-3.1-pro-preview/scenario-1-regular-8b9a120be232.json |

## Best Historical Scenario Outcomes

| Scenario | Paradigm | Best Outcome | Failure Detail | Failure Reason (Simple) | Representative Cost (NGN) | Representative Tokens | Representative File |
|---|---|---|---|---|---:|---:|---|
| 1 | Regular (with progressive discovery) | PASS | passed | passed | ₦142.94 | 39,794 | results/google_gemini-3.1-pro-preview/scenario-1-regular-8b9a120be232-1.json |
| 1 | Regular (without progressive discovery) | FAIL | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | ₦92.80 | 10,837 | results/google_gemini-3.1-pro-preview/scenario-1-regular-1fc60e21329f.json |
| 1 | Code Mode | FAIL | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:29:05.025Z,2026-04-14T18:29:05.025Z,50000 | Scenario database query failed before the run could be evaluated. | ₦0.00 | 0 | results/google_gemini-3.1-pro-preview/scenario-1-code-mode-8b9a120be232.json |
| 2 | Regular (with progressive discovery) | PASS | passed | passed | ₦17.47 | 1,443 | results/google_gemini-3.1-pro-preview/scenario-2-regular-d5f33071c10e-1.json |
| 2 | Regular (without progressive discovery) | PASS | passed | passed | ₦13.47 | 891 | results/google_gemini-3.1-pro-preview/scenario-2-regular-59ead3374656.json |
| 2 | Code Mode | FAIL | tool:code-execution; schema:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. | ₦56.89 | 3,896 | results/google_gemini-3.1-pro-preview/scenario-2-code-mode-d5f33071c10e.json |
| 3 | Regular (with progressive discovery) | FAIL | tool:channel-summary; schema:false | Tool step failed: did not summarize the Slack channel correctly. Output format did not match the required schema. | ₦28.08 | 2,087 | results/google_gemini-3.1-pro-preview/scenario-3-regular-876ef938025f.json |
| 3 | Regular (without progressive discovery) | PASS | passed | passed | ₦18.89 | 1,618 | results/google_gemini-3.1-pro-preview/scenario-3-regular-d7761acce382.json |
| 3 | Code Mode | PASS | passed | passed | ₦4.94 | 1,268 | results/google_gemini-3.1-pro-preview/scenario-3-code-mode-876ef938025f.json |
| 4 | Regular (with progressive discovery) | PASS | passed | passed | ₦12.23 | 1,244 | results/google_gemini-3.1-pro-preview/scenario-4-regular-c351e31b64c3.json |
| 4 | Regular (without progressive discovery) | PASS | passed | passed | ₦14.09 | 915 | results/google_gemini-3.1-pro-preview/scenario-4-regular-e6da09840582.json |
| 4 | Code Mode | PASS | passed | passed | ₦3.37 | 643 | results/google_gemini-3.1-pro-preview/scenario-4-code-mode-c351e31b64c3-1.json |
| 5 | Regular (with progressive discovery) | PASS | passed | passed | ₦17.83 | 1,590 | results/google_gemini-3.1-pro-preview/scenario-5-regular-7f31b9bb3c9d.json |
| 5 | Regular (without progressive discovery) | PASS | passed | passed | ₦14.61 | 1,005 | results/google_gemini-3.1-pro-preview/scenario-5-regular-dfca9c55d140.json |
| 5 | Code Mode | FAIL | tool:code-execution; schema:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. | ₦53.72 | 3,012 | results/google_gemini-3.1-pro-preview/scenario-5-code-mode-7f31b9bb3c9d-1.json |
| 6 | Regular (with progressive discovery) | PASS | passed | passed | ₦14.43 | 1,381 | results/google_gemini-3.1-pro-preview/scenario-6-regular-9dd9d6d2032e-1.json |
| 6 | Regular (without progressive discovery) | PASS | passed | passed | ₦14.11 | 1,051 | results/google_gemini-3.1-pro-preview/scenario-6-regular-d616b011d86c.json |
| 6 | Code Mode | FAIL | tool:code-execution; schema:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. | ₦56.94 | 3,895 | results/google_gemini-3.1-pro-preview/scenario-6-code-mode-9dd9d6d2032e.json |

## Run History

| Finished At | Scenario | Paradigm | Outcome | Cost (NGN) | Total Tokens | API Calls | Failure Detail | Failure Reason (Simple) | File |
|---|---:|---|---|---:|---:|---:|---|---|---|
| 2026-04-20T16:03:06.066Z | 6 | Regular (without progressive discovery) | PASS | ₦14.11 | 1,051 | 1 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-6-regular-d616b011d86c.json |
| 2026-04-20T16:02:41.438Z | 5 | Regular (without progressive discovery) | PASS | ₦14.61 | 1,005 | 1 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-5-regular-dfca9c55d140.json |
| 2026-04-20T16:02:21.633Z | 4 | Regular (without progressive discovery) | PASS | ₦14.09 | 915 | 1 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-4-regular-e6da09840582.json |
| 2026-04-20T16:02:04.202Z | 4 | Regular (without progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-4-regular-2fb7a75d5461.json |
| 2026-04-20T14:57:14.051Z | 3 | Regular (without progressive discovery) | PASS | ₦18.89 | 1,618 | 1 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-3-regular-d7761acce382.json |
| 2026-04-20T14:56:41.175Z | 2 | Regular (without progressive discovery) | PASS | ₦13.47 | 891 | 1 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-2-regular-59ead3374656.json |
| 2026-04-20T14:56:23.555Z | 1 | Regular (without progressive discovery) | FAIL | ₦92.80 | 10,837 | 1 | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/google_gemini-3.1-pro-preview/scenario-1-regular-1fc60e21329f.json |
| 2026-04-15T22:43:56.490Z | 6 | Regular (with progressive discovery) | PASS | ₦14.43 | 1,381 | 2 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-6-regular-9dd9d6d2032e-1.json |
| 2026-04-15T22:43:33.501Z | 5 | Code Mode | FAIL | ₦53.72 | 3,012 | 3 | tool:code-execution; schema:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. | results/google_gemini-3.1-pro-preview/scenario-5-code-mode-7f31b9bb3c9d-1.json |
| 2026-04-15T22:42:43.031Z | 5 | Regular (with progressive discovery) | PASS | ₦17.83 | 1,590 | 2 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-5-regular-7f31b9bb3c9d.json |
| 2026-04-15T22:42:09.848Z | 4 | Code Mode | PASS | ₦3.37 | 643 | 1 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-4-code-mode-c351e31b64c3-1.json |
| 2026-04-15T22:41:00.076Z | 2 | Regular (with progressive discovery) | PASS | ₦17.47 | 1,443 | 2 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-2-regular-d5f33071c10e-1.json |
| 2026-04-15T15:48:47.664Z | 6 | Code Mode | FAIL | ₦56.94 | 3,895 | 3 | tool:code-execution; schema:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. | results/google_gemini-3.1-pro-preview/scenario-6-code-mode-9dd9d6d2032e.json |
| 2026-04-15T15:47:14.797Z | 6 | Regular (with progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Unable to make request: Error: The socket connection was closed unexpectedly. For more information, pass `verbose: true` in the second argument to fetch() | Run failed due to benchmark/model mismatch. | results/google_gemini-3.1-pro-preview/scenario-6-regular-9dd9d6d2032e.json |
| 2026-04-15T15:46:49.277Z | 5 | Code Mode | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-5-code-mode-7f31b9bb3c9d.json |
| 2026-04-15T15:46:28.639Z | 5 | Regular (with progressive discovery) | FAIL | ₦4.08 | 524 | 1 | Response failed: {"code":"server_error","message":"internal stream ended unexpectedly"} | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-5-regular-7f31b9bb3c9d-1.json |
| 2026-04-15T15:45:35.741Z | 4 | Code Mode | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-4-code-mode-c351e31b64c3.json |
| 2026-04-15T15:45:14.596Z | 2 | Regular (with progressive discovery) | FAIL | ₦3.35 | 539 | 1 | Response failed: {"code":"server_error","message":"internal stream ended unexpectedly"} | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-2-regular-d5f33071c10e-2.json |
| 2026-04-14T18:35:05.841Z | 4 | Regular (with progressive discovery) | PASS | ₦12.23 | 1,244 | 2 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-4-regular-c351e31b64c3.json |
| 2026-04-14T18:34:22.549Z | 3 | Code Mode | PASS | ₦4.94 | 1,268 | 1 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-3-code-mode-876ef938025f.json |
| 2026-04-14T18:33:46.287Z | 3 | Regular (with progressive discovery) | FAIL | ₦28.08 | 2,087 | 2 | tool:channel-summary; schema:false | Tool step failed: did not summarize the Slack channel correctly. Output format did not match the required schema. | results/google_gemini-3.1-pro-preview/scenario-3-regular-876ef938025f.json |
| 2026-04-14T18:33:01.834Z | 2 | Code Mode | FAIL | ₦56.89 | 3,896 | 3 | tool:code-execution; schema:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. | results/google_gemini-3.1-pro-preview/scenario-2-code-mode-d5f33071c10e.json |
| 2026-04-14T18:32:09.466Z | 2 | Regular (with progressive discovery) | FAIL | ₦3.46 | 441 | 1 | Response failed: {"code":"server_error","message":"internal stream ended unexpectedly"} | Provider/network issue prevented a usable model response. | results/google_gemini-3.1-pro-preview/scenario-2-regular-d5f33071c10e.json |
| 2026-04-14T18:31:34.683Z | 1 | Code Mode | FAIL | ₦55.31 | 3,457 | 3 | tool:code-execution; expected-result:false | Tool step failed: did not execute the required code tool. Output content did not match the expected answer. | results/google_gemini-3.1-pro-preview/scenario-1-code-mode-8b9a120be232-1.json |
| 2026-04-14T18:30:55.279Z | 1 | Regular (with progressive discovery) | PASS | ₦142.94 | 39,794 | 3 | passed | passed | results/google_gemini-3.1-pro-preview/scenario-1-regular-8b9a120be232-1.json |
| 2026-04-14T18:29:05.916Z | 1 | Code Mode | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:29:05.025Z,2026-04-14T18:29:05.025Z,50000 | Scenario database query failed before the run could be evaluated. | results/google_gemini-3.1-pro-preview/scenario-1-code-mode-8b9a120be232.json |
| 2026-04-14T18:29:02.984Z | 1 | Regular (with progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:29:01.031Z,2026-04-14T18:29:01.031Z,50000 | Scenario database query failed before the run could be evaluated. | results/google_gemini-3.1-pro-preview/scenario-1-regular-8b9a120be232.json |

