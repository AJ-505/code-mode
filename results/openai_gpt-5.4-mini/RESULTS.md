# openai/gpt-5.4-mini

Official FX conversion in this report uses the official CBN NFEM weighted average rate as at April-20-2026.

## Summary

| Paradigm | Best Passes | Covered Scenarios (max 6) | Best Pass Rate | Recorded Runs | Avg Input Tokens / Run | Avg Output Tokens / Run | Avg Total Tokens / Run | Avg Cost / Run (NGN) | Avg API Calls / Run | Attempts / Covered Scenario | Non-model Fail Runs | Benchmark/Model Fail Runs | Avg Recovery Cost (NGN) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 3/6 | 6/6 | 50.0% | 7 | 1,748 | 112 | 1,860 | ₦2.45 | 1.67 | 1.17 | 2 | 1 | n/a |
| Regular (without progressive discovery) | 4/6 | 6/6 | 66.7% | 6 | 605 | 108 | 713 | ₦1.27 | 1.00 | 1.00 | 0 | 2 | n/a |
| Code Mode | 1/6 | 6/6 | 16.7% | 6 | 1,074 | 115 | 1,188 | ₦1.78 | 0.83 | 1.00 | 2 | 3 | n/a |

## Failure Analysis (All Recorded Rounds)

Total rounds: **19**
Failed rounds: **11**

| Paradigm | Recorded Rounds | Failed Rounds | Failure Rate | Non-model Failures | Benchmark/Model Failures |
|---|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 7 | 4 | 57.1% | 2 | 2 |
| Regular (without progressive discovery) | 6 | 2 | 33.3% | 0 | 2 |
| Code Mode | 6 | 5 | 83.3% | 2 | 3 |

| Failure Reason | Count | Scenarios | Paradigms | Human-readable reason | Latest Example File |
|---|---:|---|---|---|---|
| Provider returned error | 4 | 2,3,5,6 | Regular (with progressive discovery), Code Mode | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4-mini/scenario-6-regular-a245a0609e78.json |
| tool:customer-source,transaction-window,stats; expected-result:false | 2 | 1 | Regular (without progressive discovery), Regular (with progressive discovery) | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-1-regular-08f486068eb5.json |
| tool:keyword-retrieval; expected-result:false | 1 | 4 | Regular (without progressive discovery) | Tool step failed: did not retrieve keyword matches from Drive correctly. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-4-regular-c3ca81669108.json |
| schema:false; expected-result:false | 1 | 6 | Code Mode | Output format did not match the required schema. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-6-code-mode-a245a0609e78.json |
| expected-result:false | 1 | 4 | Code Mode | Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-4-code-mode-955144330194.json |
| tool:channel-summary; schema:false; expected-result:false | 1 | 3 | Regular (with progressive discovery) | Tool step failed: did not summarize the Slack channel correctly. Output format did not match the required schema. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-3-regular-1a7e8839e603-1.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-13T13:48:50.467Z,2026-04-20T13:48:50.467Z,50000 | 1 | 1 | Code Mode | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4-mini/scenario-1-code-mode-8a48076037be.json |

## Best Historical Scenario Outcomes

| Scenario | Paradigm | Best Outcome | Failure Detail | Failure Reason (Simple) | Representative Cost (NGN) | Representative Tokens | Representative File |
|---|---|---|---|---|---:|---:|---|
| 1 | Regular (with progressive discovery) | FAIL | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | ₦7.15 | 6,606 | results/openai_gpt-5.4-mini/scenario-1-regular-8a48076037be.json |
| 1 | Regular (without progressive discovery) | FAIL | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | ₦1.96 | 1,587 | results/openai_gpt-5.4-mini/scenario-1-regular-08f486068eb5.json |
| 1 | Code Mode | FAIL | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-13T13:48:50.467Z,2026-04-20T13:48:50.467Z,50000 | Scenario database query failed before the run could be evaluated. | ₦0.00 | 0 | results/openai_gpt-5.4-mini/scenario-1-code-mode-8a48076037be.json |
| 2 | Regular (with progressive discovery) | PASS | passed | passed | ₦1.71 | 873 | results/openai_gpt-5.4-mini/scenario-2-regular-ca2d2187221a.json |
| 2 | Regular (without progressive discovery) | PASS | passed | passed | ₦1.19 | 471 | results/openai_gpt-5.4-mini/scenario-2-regular-4f53d3c21bb6.json |
| 2 | Code Mode | FAIL | Provider returned error | Provider/network issue prevented a usable model response. | ₦4.61 | 2,520 | results/openai_gpt-5.4-mini/scenario-2-code-mode-ca2d2187221a.json |
| 3 | Regular (with progressive discovery) | PASS | passed | passed | ₦2.30 | 1,401 | results/openai_gpt-5.4-mini/scenario-3-regular-1a7e8839e603.json |
| 3 | Regular (without progressive discovery) | PASS | passed | passed | ₦1.48 | 844 | results/openai_gpt-5.4-mini/scenario-3-regular-465ea4c37ce8.json |
| 3 | Code Mode | FAIL | Provider returned error | Provider/network issue prevented a usable model response. | ₦3.20 | 1,847 | results/openai_gpt-5.4-mini/scenario-3-code-mode-1a7e8839e603.json |
| 4 | Regular (with progressive discovery) | PASS | passed | passed | ₦2.28 | 1,319 | results/openai_gpt-5.4-mini/scenario-4-regular-955144330194.json |
| 4 | Regular (without progressive discovery) | FAIL | tool:keyword-retrieval; expected-result:false | Tool step failed: did not retrieve keyword matches from Drive correctly. Output content did not match the expected answer. | ₦0.92 | 423 | results/openai_gpt-5.4-mini/scenario-4-regular-c3ca81669108.json |
| 4 | Code Mode | FAIL | expected-result:false | Output content did not match the expected answer. | ₦1.13 | 1,089 | results/openai_gpt-5.4-mini/scenario-4-code-mode-955144330194.json |
| 5 | Regular (with progressive discovery) | FAIL | Provider returned error | Provider/network issue prevented a usable model response. | ₦0.66 | 509 | results/openai_gpt-5.4-mini/scenario-5-regular-caec58c8367f.json |
| 5 | Regular (without progressive discovery) | PASS | passed | passed | ₦0.97 | 462 | results/openai_gpt-5.4-mini/scenario-5-regular-fce2ddd720c7.json |
| 5 | Code Mode | PASS | passed | passed | ₦0.52 | 480 | results/openai_gpt-5.4-mini/scenario-5-code-mode-caec58c8367f.json |
| 6 | Regular (with progressive discovery) | FAIL | Provider returned error | Provider/network issue prevented a usable model response. | ₦0.58 | 452 | results/openai_gpt-5.4-mini/scenario-6-regular-a245a0609e78.json |
| 6 | Regular (without progressive discovery) | PASS | passed | passed | ₦1.09 | 491 | results/openai_gpt-5.4-mini/scenario-6-regular-547f448bab3c.json |
| 6 | Code Mode | FAIL | schema:false; expected-result:false | Output format did not match the required schema. Output content did not match the expected answer. | ₦1.24 | 1,193 | results/openai_gpt-5.4-mini/scenario-6-code-mode-a245a0609e78.json |

## Run History

| Finished At | Scenario | Paradigm | Outcome | Cost (NGN) | Total Tokens | API Calls | Failure Detail | Failure Reason (Simple) | File |
|---|---:|---|---|---:|---:|---:|---|---|---|
| 2026-04-20T16:11:12.511Z | 6 | Regular (without progressive discovery) | PASS | ₦1.09 | 491 | 1 | passed | passed | results/openai_gpt-5.4-mini/scenario-6-regular-547f448bab3c.json |
| 2026-04-20T16:09:58.194Z | 5 | Regular (without progressive discovery) | PASS | ₦0.97 | 462 | 1 | passed | passed | results/openai_gpt-5.4-mini/scenario-5-regular-fce2ddd720c7.json |
| 2026-04-20T16:09:48.334Z | 4 | Regular (without progressive discovery) | FAIL | ₦0.92 | 423 | 1 | tool:keyword-retrieval; expected-result:false | Tool step failed: did not retrieve keyword matches from Drive correctly. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-4-regular-c3ca81669108.json |
| 2026-04-20T16:09:43.568Z | 3 | Regular (without progressive discovery) | PASS | ₦1.48 | 844 | 1 | passed | passed | results/openai_gpt-5.4-mini/scenario-3-regular-465ea4c37ce8.json |
| 2026-04-20T16:09:38.527Z | 2 | Regular (without progressive discovery) | PASS | ₦1.19 | 471 | 1 | passed | passed | results/openai_gpt-5.4-mini/scenario-2-regular-4f53d3c21bb6.json |
| 2026-04-20T16:09:32.571Z | 1 | Regular (without progressive discovery) | FAIL | ₦1.96 | 1,587 | 1 | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-1-regular-08f486068eb5.json |
| 2026-04-20T13:53:19.451Z | 6 | Code Mode | FAIL | ₦1.24 | 1,193 | 1 | schema:false; expected-result:false | Output format did not match the required schema. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-6-code-mode-a245a0609e78.json |
| 2026-04-20T13:53:04.497Z | 6 | Regular (with progressive discovery) | FAIL | ₦0.58 | 452 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4-mini/scenario-6-regular-a245a0609e78.json |
| 2026-04-20T13:52:57.848Z | 5 | Code Mode | PASS | ₦0.52 | 480 | 1 | passed | passed | results/openai_gpt-5.4-mini/scenario-5-code-mode-caec58c8367f.json |
| 2026-04-20T13:52:53.064Z | 5 | Regular (with progressive discovery) | FAIL | ₦0.66 | 509 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4-mini/scenario-5-regular-caec58c8367f.json |
| 2026-04-20T13:52:44.949Z | 4 | Code Mode | FAIL | ₦1.13 | 1,089 | 1 | expected-result:false | Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-4-code-mode-955144330194.json |
| 2026-04-20T13:52:33.288Z | 4 | Regular (with progressive discovery) | PASS | ₦2.28 | 1,319 | 2 | passed | passed | results/openai_gpt-5.4-mini/scenario-4-regular-955144330194.json |
| 2026-04-20T13:52:22.078Z | 3 | Code Mode | FAIL | ₦3.20 | 1,847 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4-mini/scenario-3-code-mode-1a7e8839e603.json |
| 2026-04-20T13:52:00.186Z | 3 | Regular (with progressive discovery) | FAIL | ₦2.24 | 1,391 | 2 | tool:channel-summary; schema:false; expected-result:false | Tool step failed: did not summarize the Slack channel correctly. Output format did not match the required schema. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-3-regular-1a7e8839e603-1.json |
| 2026-04-20T13:49:33.954Z | 3 | Regular (with progressive discovery) | PASS | ₦2.30 | 1,401 | 2 | passed | passed | results/openai_gpt-5.4-mini/scenario-3-regular-1a7e8839e603.json |
| 2026-04-20T13:49:22.059Z | 2 | Code Mode | FAIL | ₦4.61 | 2,520 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4-mini/scenario-2-code-mode-ca2d2187221a.json |
| 2026-04-20T13:49:00.649Z | 2 | Regular (with progressive discovery) | PASS | ₦1.71 | 873 | 2 | passed | passed | results/openai_gpt-5.4-mini/scenario-2-regular-ca2d2187221a.json |
| 2026-04-20T13:48:51.318Z | 1 | Code Mode | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-13T13:48:50.467Z,2026-04-20T13:48:50.467Z,50000 | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4-mini/scenario-1-code-mode-8a48076037be.json |
| 2026-04-20T13:48:48.077Z | 1 | Regular (with progressive discovery) | FAIL | ₦7.15 | 6,606 | 2 | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-1-regular-8a48076037be.json |

