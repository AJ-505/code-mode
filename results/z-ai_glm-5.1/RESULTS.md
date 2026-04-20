# z-ai/glm-5.1

Official FX conversion in this report uses the official CBN NFEM weighted average rate as at April-20-2026.

## Summary

| Paradigm | Best Passes | Covered Scenarios (max 6) | Best Pass Rate | Recorded Runs | Avg Input Tokens / Run | Avg Output Tokens / Run | Avg Total Tokens / Run | Avg Cost / Run (NGN) | Avg API Calls / Run | Attempts / Covered Scenario | Non-model Fail Runs | Benchmark/Model Fail Runs | Avg Recovery Cost (NGN) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 3/6 | 6/6 | 50.0% | 6 | 7,274 | 544 | 7,818 | ₦5.02 | 2.17 | 1.00 | 0 | 3 | n/a |
| Regular (without progressive discovery) | 4/6 | 6/6 | 66.7% | 6 | 536 | 324 | 860 | ₦1.03 | 0.83 | 1.00 | 0 | 2 | n/a |
| Code Mode | 6/6 | 6/6 | 100.0% | 7 | 1,818 | 149 | 1,967 | ₦1.29 | 1.17 | 1.17 | 0 | 0 | n/a |

## Failure Analysis (All Recorded Rounds)

Total rounds: **19**
Failed rounds: **6**

| Paradigm | Recorded Rounds | Failed Rounds | Failure Rate | Non-model Failures | Benchmark/Model Failures |
|---|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 6 | 3 | 50.0% | 0 | 3 |
| Regular (without progressive discovery) | 6 | 2 | 33.3% | 0 | 2 |
| Code Mode | 7 | 1 | 14.3% | 1 | 0 |

| Failure Reason | Count | Scenarios | Paradigms | Human-readable reason | Latest Example File |
|---|---:|---|---|---|---|
| tool:keyword-retrieval; schema:false; expected-result:false | 1 | 4 | Regular (without progressive discovery) | Tool step failed: did not retrieve keyword matches from Drive correctly. Output format did not match the required schema. Output content did not match the expected answer. | results/z-ai_glm-5.1/scenario-4-regular-ddea1ee86a58.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-13T16:11:14.270Z,2026-04-20T16:11:14.270Z,50000 | 1 | 1 | Regular (without progressive discovery) | Scenario database query failed before the run could be evaluated. | results/z-ai_glm-5.1/scenario-1-regular-a264e8e045ed.json |
| Timeout while waiting for code_mode response after 120000ms | 1 | 6 | Code Mode | Provider/network issue prevented a usable model response. | results/z-ai_glm-5.1/scenario-6-code-mode-25ed2d3b86ba-1.json |
| tool:slot-proposal; schema:false | 1 | 5 | Regular (with progressive discovery) | Tool step failed: failed tool group: slot-proposal. Output format did not match the required schema. | results/z-ai_glm-5.1/scenario-5-regular-a02b3bd62400.json |
| tool:progressive-discovery,keyword-retrieval; schema:false | 1 | 4 | Regular (with progressive discovery) | Tool step failed: did not discover required tools first; did not retrieve keyword matches from Drive correctly. Output format did not match the required schema. | results/z-ai_glm-5.1/scenario-4-regular-8701910ee0e5.json |
| tool:channel-summary; schema:false | 1 | 3 | Regular (with progressive discovery) | Tool step failed: did not summarize the Slack channel correctly. Output format did not match the required schema. | results/z-ai_glm-5.1/scenario-3-regular-eb185f48038d.json |

## Best Historical Scenario Outcomes

| Scenario | Paradigm | Best Outcome | Failure Detail | Failure Reason (Simple) | Representative Cost (NGN) | Representative Tokens | Representative File |
|---|---|---|---|---|---:|---:|---|
| 1 | Regular (with progressive discovery) | PASS | passed | passed | ₦20.31 | 36,508 | results/z-ai_glm-5.1/scenario-1-regular-bebec5f02598.json |
| 1 | Regular (without progressive discovery) | FAIL | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-13T16:11:14.270Z,2026-04-20T16:11:14.270Z,50000 | Scenario database query failed before the run could be evaluated. | ₦0.00 | 0 | results/z-ai_glm-5.1/scenario-1-regular-a264e8e045ed.json |
| 1 | Code Mode | PASS | passed | passed | ₦3.67 | 5,757 | results/z-ai_glm-5.1/scenario-1-code-mode-bebec5f02598.json |
| 2 | Regular (with progressive discovery) | PASS | passed | passed | ₦1.92 | 1,786 | results/z-ai_glm-5.1/scenario-2-regular-d62a2c01e181.json |
| 2 | Regular (without progressive discovery) | PASS | passed | passed | ₦1.69 | 1,125 | results/z-ai_glm-5.1/scenario-2-regular-100fec54a0c0.json |
| 2 | Code Mode | PASS | passed | passed | ₦0.93 | 1,626 | results/z-ai_glm-5.1/scenario-2-code-mode-d62a2c01e181.json |
| 3 | Regular (with progressive discovery) | FAIL | tool:channel-summary; schema:false | Tool step failed: did not summarize the Slack channel correctly. Output format did not match the required schema. | ₦2.13 | 2,667 | results/z-ai_glm-5.1/scenario-3-regular-eb185f48038d.json |
| 3 | Regular (without progressive discovery) | PASS | passed | passed | ₦1.48 | 1,585 | results/z-ai_glm-5.1/scenario-3-regular-28ff494e083d.json |
| 3 | Code Mode | PASS | passed | passed | ₦0.70 | 895 | results/z-ai_glm-5.1/scenario-3-code-mode-eb185f48038d.json |
| 4 | Regular (with progressive discovery) | FAIL | tool:progressive-discovery,keyword-retrieval; schema:false | Tool step failed: did not discover required tools first; did not retrieve keyword matches from Drive correctly. Output format did not match the required schema. | ₦1.68 | 1,816 | results/z-ai_glm-5.1/scenario-4-regular-8701910ee0e5.json |
| 4 | Regular (without progressive discovery) | FAIL | tool:keyword-retrieval; schema:false; expected-result:false | Tool step failed: did not retrieve keyword matches from Drive correctly. Output format did not match the required schema. Output content did not match the expected answer. | ₦0.51 | 478 | results/z-ai_glm-5.1/scenario-4-regular-ddea1ee86a58.json |
| 4 | Code Mode | PASS | passed | passed | ₦0.75 | 1,145 | results/z-ai_glm-5.1/scenario-4-code-mode-8701910ee0e5.json |
| 5 | Regular (with progressive discovery) | FAIL | tool:slot-proposal; schema:false | Tool step failed: failed tool group: slot-proposal. Output format did not match the required schema. | ₦2.28 | 2,266 | results/z-ai_glm-5.1/scenario-5-regular-a02b3bd62400.json |
| 5 | Regular (without progressive discovery) | PASS | passed | passed | ₦1.39 | 1,066 | results/z-ai_glm-5.1/scenario-5-regular-ade55fe33ccf.json |
| 5 | Code Mode | PASS | passed | passed | ₦1.18 | 1,613 | results/z-ai_glm-5.1/scenario-5-code-mode-a02b3bd62400.json |
| 6 | Regular (with progressive discovery) | PASS | passed | passed | ₦1.80 | 1,862 | results/z-ai_glm-5.1/scenario-6-regular-25ed2d3b86ba.json |
| 6 | Regular (without progressive discovery) | PASS | passed | passed | ₦1.10 | 904 | results/z-ai_glm-5.1/scenario-6-regular-137b72e9e994.json |
| 6 | Code Mode | PASS | passed | passed | ₦0.50 | 768 | results/z-ai_glm-5.1/scenario-6-code-mode-25ed2d3b86ba.json |

## Run History

| Finished At | Scenario | Paradigm | Outcome | Cost (NGN) | Total Tokens | API Calls | Failure Detail | Failure Reason (Simple) | File |
|---|---:|---|---|---:|---:|---:|---|---|---|
| 2026-04-20T16:13:38.857Z | 6 | Regular (without progressive discovery) | PASS | ₦1.10 | 904 | 1 | passed | passed | results/z-ai_glm-5.1/scenario-6-regular-137b72e9e994.json |
| 2026-04-20T16:13:04.507Z | 5 | Regular (without progressive discovery) | PASS | ₦1.39 | 1,066 | 1 | passed | passed | results/z-ai_glm-5.1/scenario-5-regular-ade55fe33ccf.json |
| 2026-04-20T16:12:35.180Z | 4 | Regular (without progressive discovery) | FAIL | ₦0.51 | 478 | 1 | tool:keyword-retrieval; schema:false; expected-result:false | Tool step failed: did not retrieve keyword matches from Drive correctly. Output format did not match the required schema. Output content did not match the expected answer. | results/z-ai_glm-5.1/scenario-4-regular-ddea1ee86a58.json |
| 2026-04-20T16:12:22.992Z | 3 | Regular (without progressive discovery) | PASS | ₦1.48 | 1,585 | 1 | passed | passed | results/z-ai_glm-5.1/scenario-3-regular-28ff494e083d.json |
| 2026-04-20T16:11:42.328Z | 2 | Regular (without progressive discovery) | PASS | ₦1.69 | 1,125 | 1 | passed | passed | results/z-ai_glm-5.1/scenario-2-regular-100fec54a0c0.json |
| 2026-04-20T16:11:15.099Z | 1 | Regular (without progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-13T16:11:14.270Z,2026-04-20T16:11:14.270Z,50000 | Scenario database query failed before the run could be evaluated. | results/z-ai_glm-5.1/scenario-1-regular-a264e8e045ed.json |
| 2026-04-15T22:47:40.080Z | 6 | Code Mode | PASS | ₦0.50 | 768 | 1 | passed | passed | results/z-ai_glm-5.1/scenario-6-code-mode-25ed2d3b86ba.json |
| 2026-04-15T14:34:37.710Z | 6 | Code Mode | FAIL | ₦0.00 | 0 | 0 | Timeout while waiting for code_mode response after 120000ms | Provider/network issue prevented a usable model response. | results/z-ai_glm-5.1/scenario-6-code-mode-25ed2d3b86ba-1.json |
| 2026-04-15T14:32:37.089Z | 6 | Regular (with progressive discovery) | PASS | ₦1.80 | 1,862 | 2 | passed | passed | results/z-ai_glm-5.1/scenario-6-regular-25ed2d3b86ba.json |
| 2026-04-15T14:31:57.219Z | 5 | Code Mode | PASS | ₦1.18 | 1,613 | 1 | passed | passed | results/z-ai_glm-5.1/scenario-5-code-mode-a02b3bd62400.json |
| 2026-04-15T14:30:37.120Z | 5 | Regular (with progressive discovery) | FAIL | ₦2.28 | 2,266 | 2 | tool:slot-proposal; schema:false | Tool step failed: failed tool group: slot-proposal. Output format did not match the required schema. | results/z-ai_glm-5.1/scenario-5-regular-a02b3bd62400.json |
| 2026-04-15T14:29:03.663Z | 4 | Code Mode | PASS | ₦0.75 | 1,145 | 1 | passed | passed | results/z-ai_glm-5.1/scenario-4-code-mode-8701910ee0e5.json |
| 2026-04-15T14:27:59.728Z | 4 | Regular (with progressive discovery) | FAIL | ₦1.68 | 1,816 | 2 | tool:progressive-discovery,keyword-retrieval; schema:false | Tool step failed: did not discover required tools first; did not retrieve keyword matches from Drive correctly. Output format did not match the required schema. | results/z-ai_glm-5.1/scenario-4-regular-8701910ee0e5.json |
| 2026-04-15T14:26:53.233Z | 3 | Code Mode | PASS | ₦0.70 | 895 | 1 | passed | passed | results/z-ai_glm-5.1/scenario-3-code-mode-eb185f48038d.json |
| 2026-04-15T14:25:49.078Z | 3 | Regular (with progressive discovery) | FAIL | ₦2.13 | 2,667 | 2 | tool:channel-summary; schema:false | Tool step failed: did not summarize the Slack channel correctly. Output format did not match the required schema. | results/z-ai_glm-5.1/scenario-3-regular-eb185f48038d.json |
| 2026-04-15T14:24:21.347Z | 2 | Code Mode | PASS | ₦0.93 | 1,626 | 1 | passed | passed | results/z-ai_glm-5.1/scenario-2-code-mode-d62a2c01e181.json |
| 2026-04-15T14:23:26.236Z | 2 | Regular (with progressive discovery) | PASS | ₦1.92 | 1,786 | 2 | passed | passed | results/z-ai_glm-5.1/scenario-2-regular-d62a2c01e181.json |
| 2026-04-15T14:22:43.356Z | 1 | Code Mode | PASS | ₦3.67 | 5,757 | 2 | passed | passed | results/z-ai_glm-5.1/scenario-1-code-mode-bebec5f02598.json |
| 2026-04-15T14:20:42.596Z | 1 | Regular (with progressive discovery) | PASS | ₦20.31 | 36,508 | 3 | passed | passed | results/z-ai_glm-5.1/scenario-1-regular-bebec5f02598.json |

