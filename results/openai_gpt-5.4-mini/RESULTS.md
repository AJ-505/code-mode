# openai/gpt-5.4-mini

Official FX conversion in this report uses the official CBN NFEM weighted average rate as at April-20-2026.

## Summary

| Paradigm | Best Passes | Covered Scenarios (max 6) | Best Pass Rate | Recorded Runs | Avg Input Tokens / Run | Avg Output Tokens / Run | Avg Total Tokens / Run | Avg Cost / Run (NGN) | Avg API Calls / Run | Attempts / Covered Scenario | Non-model Fail Runs | Benchmark/Model Fail Runs | Avg Recovery Cost (NGN) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 3/6 | 6/6 | 50.0% | 7 | 1,748 | 112 | 1,860 | ₦2.45 | 1.67 | 1.17 | 2 | 1 | n/a |
| Regular (without progressive discovery) | 4/6 | 6/6 | 66.7% | 6 | 605 | 108 | 713 | ₦1.27 | 1.00 | 1.00 | 0 | 2 | n/a |
| Code Mode (progressive API discovery) | 4/6 | 6/6 | 66.7% | 17 | 749 | 102 | 851 | ₦1.38 | 0.83 | 2.83 | 0 | 2 | ₦1.42 |
| Code Mode (full API context) | 1/6 | 6/6 | 16.7% | 6 | 1,074 | 115 | 1,188 | ₦1.78 | 0.83 | 1.00 | 2 | 3 | n/a |

## Best Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 4 | 75.0% | 2,396 | 154 | 2,550 | ₦3.36 | 2.00 | 6,298 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 66.7% | 605 | 108 | 713 | ₦1.27 | 1.00 | 20,077 ms | 0.00 |
| Code Mode (progressive API discovery) | 6 | 66.7% | 749 | 102 | 851 | ₦1.38 | 0.83 | 7,133 ms | 0.00 |
| Code Mode (full API context) | 4 | 25.0% | 686 | 5 | 691 | ₦0.72 | 0.75 | 8,348 ms | 0.00 |

## Worst Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 4 | 50.0% | 2,396 | 152 | 2,547 | ₦3.35 | 2.00 | 5,873 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 66.7% | 605 | 108 | 713 | ₦1.27 | 1.00 | 20,077 ms | 0.00 |
| Code Mode (progressive API discovery) | 6 | 50.0% | 1,143 | 102 | 1,245 | ₦1.78 | 1.17 | 7,975 ms | 0.50 |
| Code Mode (full API context) | 4 | 25.0% | 686 | 5 | 691 | ₦0.72 | 0.75 | 8,348 ms | 0.00 |

## Average Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 5 | 60.0% | 2,162 | 156 | 2,318 | ₦3.14 | 2.00 | 5,708 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 66.7% | 605 | 108 | 713 | ₦1.27 | 1.00 | 20,077 ms | 0.00 |
| Code Mode (progressive API discovery) | 11 | 36.4% | 872 | 85 | 957 | ₦1.40 | 0.91 | 8,185 ms | 0.27 |
| Code Mode (full API context) | 4 | 25.0% | 686 | 5 | 691 | ₦0.72 | 0.75 | 8,348 ms | 0.00 |

## Recovery Benchmarks

Lower is better for retries, cost, and time.

| Paradigm | Recovered Cases | Avg Retries To Recover | Avg Recovery Cost (NGN) | Avg Recovery Time |
|---|---:|---:|---:|---:|
| Regular (with progressive discovery) | 0 | n/a | n/a | n/a |
| Regular (without progressive discovery) | 0 | n/a | n/a | n/a |
| Code Mode (progressive API discovery) | 1 | 1.00 | ₦1.42 | 2,305,353 ms |
| Code Mode (full API context) | 0 | n/a | n/a | n/a |

## Failure Analysis (All Recorded Rounds)

Total rounds: **40**
Failed rounds: **28**

| Paradigm | Recorded Rounds | Failed Rounds | Failure Rate | Non-model Failures | Benchmark/Model Failures |
|---|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 7 | 4 | 57.1% | 2 | 2 |
| Regular (without progressive discovery) | 6 | 2 | 33.3% | 0 | 2 |
| Code Mode (progressive API discovery) | 21 | 17 | 81.0% | 6 | 11 |
| Code Mode (full API context) | 6 | 5 | 83.3% | 2 | 3 |

| Failure Reason | Count | Scenarios | Paradigms | Human-readable reason | Latest Example File |
|---|---:|---|---|---|---|
| Provider returned error | 10 | 2,3,4,5,6 | Code Mode (progressive API discovery), Regular (with progressive discovery), Code Mode (full API context) | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4-mini/scenario-5-code-mode-caec58c8367f-2.json |
| tool:api-definition-search | 4 | 2,3,4,5 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search. | results/openai_gpt-5.4-mini/scenario-5-code-mode-caec58c8367f-3.json |
| No transactions found in the last 7 days. Run the seed script first. | 3 | 1 | Code Mode (progressive API discovery) | Run failed due to benchmark/model mismatch. | results/openai_gpt-5.4-mini/scenario-1-code-mode-8a48076037be-3.json |
| expected-result:false | 2 | 4,6 | Code Mode (progressive API discovery), Code Mode (full API context) | Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-6-code-mode-a245a0609e78-3.json |
| tool:api-definition-search; expected-result:false | 2 | 3,6 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-6-code-mode-a245a0609e78-2.json |
| tool:customer-source,transaction-window,stats; expected-result:false | 2 | 1 | Regular (without progressive discovery), Regular (with progressive discovery) | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-1-regular-08f486068eb5.json |
| tool:api-definition-search,code-execution; schema:false; expected-result:false | 1 | 6 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search; did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-6-code-mode-a245a0609e78-1.json |
| tool:keyword-retrieval; expected-result:false | 1 | 4 | Regular (without progressive discovery) | Tool step failed: did not retrieve keyword matches from Drive correctly. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-4-regular-c3ca81669108.json |
| schema:false; expected-result:false | 1 | 6 | Code Mode (full API context) | Output format did not match the required schema. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-6-code-mode-a245a0609e78.json |
| tool:channel-summary; schema:false; expected-result:false | 1 | 3 | Regular (with progressive discovery) | Tool step failed: did not summarize the Slack channel correctly. Output format did not match the required schema. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-3-regular-1a7e8839e603-1.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-13T13:48:50.467Z,2026-04-20T13:48:50.467Z,50000 | 1 | 1 | Code Mode (full API context) | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4-mini/scenario-1-code-mode-8a48076037be.json |

## Best Historical Scenario Outcomes

| Scenario | Paradigm | Best Outcome | Failure Detail | Failure Reason (Simple) | Representative Cost (NGN) | Representative Tokens | Representative File |
|---|---|---|---|---|---:|---:|---|
| 1 | Regular (with progressive discovery) | FAIL | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | ₦7.15 | 6,606 | results/openai_gpt-5.4-mini/scenario-1-regular-8a48076037be.json |
| 1 | Regular (without progressive discovery) | FAIL | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | ₦1.96 | 1,587 | results/openai_gpt-5.4-mini/scenario-1-regular-08f486068eb5.json |
| 1 | Code Mode (progressive API discovery) | FAIL | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | ₦0.00 | 0 | results/openai_gpt-5.4-mini/scenario-1-code-mode-8a48076037be-3.json |
| 1 | Code Mode (full API context) | FAIL | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-13T13:48:50.467Z,2026-04-20T13:48:50.467Z,50000 | Scenario database query failed before the run could be evaluated. | ₦0.00 | 0 | results/openai_gpt-5.4-mini/scenario-1-code-mode-8a48076037be.json |
| 2 | Regular (with progressive discovery) | PASS | passed | passed | ₦1.71 | 873 | results/openai_gpt-5.4-mini/scenario-2-regular-ca2d2187221a.json |
| 2 | Regular (without progressive discovery) | PASS | passed | passed | ₦1.19 | 471 | results/openai_gpt-5.4-mini/scenario-2-regular-4f53d3c21bb6.json |
| 2 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦2.02 | 1,067 | results/openai_gpt-5.4-mini/scenario-2-code-mode-29c043d19c9f.json |
| 2 | Code Mode (full API context) | FAIL | Provider returned error | Provider/network issue prevented a usable model response. | ₦4.61 | 2,520 | results/openai_gpt-5.4-mini/scenario-2-code-mode-ca2d2187221a.json |
| 3 | Regular (with progressive discovery) | PASS | passed | passed | ₦2.30 | 1,401 | results/openai_gpt-5.4-mini/scenario-3-regular-1a7e8839e603.json |
| 3 | Regular (without progressive discovery) | PASS | passed | passed | ₦1.48 | 844 | results/openai_gpt-5.4-mini/scenario-3-regular-465ea4c37ce8.json |
| 3 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦1.70 | 1,057 | results/openai_gpt-5.4-mini/scenario-3-code-mode-dd956082bc9b-1.json |
| 3 | Code Mode (full API context) | FAIL | Provider returned error | Provider/network issue prevented a usable model response. | ₦3.20 | 1,847 | results/openai_gpt-5.4-mini/scenario-3-code-mode-1a7e8839e603.json |
| 4 | Regular (with progressive discovery) | PASS | passed | passed | ₦2.28 | 1,319 | results/openai_gpt-5.4-mini/scenario-4-regular-955144330194.json |
| 4 | Regular (without progressive discovery) | FAIL | tool:keyword-retrieval; expected-result:false | Tool step failed: did not retrieve keyword matches from Drive correctly. Output content did not match the expected answer. | ₦0.92 | 423 | results/openai_gpt-5.4-mini/scenario-4-regular-c3ca81669108.json |
| 4 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦1.45 | 929 | results/openai_gpt-5.4-mini/scenario-4-code-mode-8559c19ddb34-3.json |
| 4 | Code Mode (full API context) | FAIL | expected-result:false | Output content did not match the expected answer. | ₦1.13 | 1,089 | results/openai_gpt-5.4-mini/scenario-4-code-mode-955144330194.json |
| 5 | Regular (with progressive discovery) | FAIL | Provider returned error | Provider/network issue prevented a usable model response. | ₦0.66 | 509 | results/openai_gpt-5.4-mini/scenario-5-regular-caec58c8367f.json |
| 5 | Regular (without progressive discovery) | PASS | passed | passed | ₦0.97 | 462 | results/openai_gpt-5.4-mini/scenario-5-regular-fce2ddd720c7.json |
| 5 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦1.60 | 1,007 | results/openai_gpt-5.4-mini/scenario-5-code-mode-caec58c8367f-4.json |
| 5 | Code Mode (full API context) | PASS | passed | passed | ₦0.52 | 480 | results/openai_gpt-5.4-mini/scenario-5-code-mode-caec58c8367f.json |
| 6 | Regular (with progressive discovery) | FAIL | Provider returned error | Provider/network issue prevented a usable model response. | ₦0.58 | 452 | results/openai_gpt-5.4-mini/scenario-6-regular-a245a0609e78.json |
| 6 | Regular (without progressive discovery) | PASS | passed | passed | ₦1.09 | 491 | results/openai_gpt-5.4-mini/scenario-6-regular-547f448bab3c.json |
| 6 | Code Mode (progressive API discovery) | FAIL | expected-result:false | Output content did not match the expected answer. | ₦1.50 | 1,047 | results/openai_gpt-5.4-mini/scenario-6-code-mode-a245a0609e78-3.json |
| 6 | Code Mode (full API context) | FAIL | schema:false; expected-result:false | Output format did not match the required schema. Output content did not match the expected answer. | ₦1.24 | 1,193 | results/openai_gpt-5.4-mini/scenario-6-code-mode-a245a0609e78.json |

## Run History

| Finished At | Scenario | Paradigm | Outcome | Cost (NGN) | Total Tokens | API Calls | Failure Detail | Failure Reason (Simple) | File |
|---|---:|---|---|---:|---:|---:|---|---|---|
| 2026-04-20T18:46:22.415Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦1.50 | 1,047 | 1 | expected-result:false | Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-6-code-mode-a245a0609e78-3.json |
| 2026-04-20T18:46:10.234Z | 5 | Code Mode (progressive API discovery) | PASS | ₦1.60 | 1,007 | 1 | passed | passed | results/openai_gpt-5.4-mini/scenario-5-code-mode-caec58c8367f-4.json |
| 2026-04-20T18:46:06.690Z | 3 | Code Mode (progressive API discovery) | PASS | ₦1.70 | 1,057 | 1 | passed | passed | results/openai_gpt-5.4-mini/scenario-3-code-mode-dd956082bc9b-1.json |
| 2026-04-20T18:46:06.244Z | 4 | Code Mode (progressive API discovery) | PASS | ₦1.45 | 929 | 1 | passed | passed | results/openai_gpt-5.4-mini/scenario-4-code-mode-8559c19ddb34-3.json |
| 2026-04-20T18:46:04.972Z | 2 | Code Mode (progressive API discovery) | PASS | ₦2.02 | 1,067 | 1 | passed | passed | results/openai_gpt-5.4-mini/scenario-2-code-mode-29c043d19c9f.json |
| 2026-04-20T18:45:56.227Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/openai_gpt-5.4-mini/scenario-1-code-mode-8a48076037be-3.json |
| 2026-04-20T18:40:39.431Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦1.53 | 960 | 1 | tool:api-definition-search; expected-result:false | Tool step failed: failed tool group: api-definition-search. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-6-code-mode-a245a0609e78-2.json |
| 2026-04-20T18:40:36.531Z | 5 | Code Mode (progressive API discovery) | FAIL | ₦1.50 | 982 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/openai_gpt-5.4-mini/scenario-5-code-mode-caec58c8367f-3.json |
| 2026-04-20T18:40:31.203Z | 4 | Code Mode (progressive API discovery) | FAIL | ₦1.45 | 929 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/openai_gpt-5.4-mini/scenario-4-code-mode-8559c19ddb34-2.json |
| 2026-04-20T18:40:29.341Z | 3 | Code Mode (progressive API discovery) | FAIL | ₦1.47 | 1,019 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/openai_gpt-5.4-mini/scenario-3-code-mode-dd956082bc9b.json |
| 2026-04-20T18:40:26.450Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦1.73 | 1,006 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/openai_gpt-5.4-mini/scenario-2-code-mode-ca2d2187221a-3.json |
| 2026-04-20T18:40:19.778Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/openai_gpt-5.4-mini/scenario-1-code-mode-8a48076037be-2.json |
| 2026-04-20T18:09:28.898Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦4.18 | 3,393 | 3 | tool:api-definition-search,code-execution; schema:false; expected-result:false | Tool step failed: failed tool group: api-definition-search; did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-6-code-mode-a245a0609e78-1.json |
| 2026-04-20T18:09:05.752Z | 5 | Code Mode (progressive API discovery) | FAIL | ₦1.49 | 1,059 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4-mini/scenario-5-code-mode-caec58c8367f-2.json |
| 2026-04-20T18:08:48.974Z | 5 | Code Mode (progressive API discovery) | FAIL | ₦1.52 | 1,200 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4-mini/scenario-5-code-mode-caec58c8367f-1.json |
| 2026-04-20T18:08:25.947Z | 4 | Code Mode (progressive API discovery) | FAIL | ₦1.44 | 980 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4-mini/scenario-4-code-mode-8559c19ddb34-1.json |
| 2026-04-20T18:08:10.310Z | 4 | Code Mode (progressive API discovery) | FAIL | ₦1.43 | 968 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4-mini/scenario-4-code-mode-8559c19ddb34.json |
| 2026-04-20T18:07:56.900Z | 3 | Code Mode (progressive API discovery) | FAIL | ₦1.42 | 1,072 | 1 | tool:api-definition-search; expected-result:false | Tool step failed: failed tool group: api-definition-search. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-3-code-mode-1a7e8839e603-1.json |
| 2026-04-20T18:07:38.818Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦1.41 | 996 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4-mini/scenario-2-code-mode-ca2d2187221a-2.json |
| 2026-04-20T18:07:25.410Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦1.28 | 977 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4-mini/scenario-2-code-mode-ca2d2187221a-1.json |
| 2026-04-20T18:07:12.597Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/openai_gpt-5.4-mini/scenario-1-code-mode-8a48076037be-1.json |
| 2026-04-20T16:11:12.511Z | 6 | Regular (without progressive discovery) | PASS | ₦1.09 | 491 | 1 | passed | passed | results/openai_gpt-5.4-mini/scenario-6-regular-547f448bab3c.json |
| 2026-04-20T16:09:58.194Z | 5 | Regular (without progressive discovery) | PASS | ₦0.97 | 462 | 1 | passed | passed | results/openai_gpt-5.4-mini/scenario-5-regular-fce2ddd720c7.json |
| 2026-04-20T16:09:48.334Z | 4 | Regular (without progressive discovery) | FAIL | ₦0.92 | 423 | 1 | tool:keyword-retrieval; expected-result:false | Tool step failed: did not retrieve keyword matches from Drive correctly. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-4-regular-c3ca81669108.json |
| 2026-04-20T16:09:43.568Z | 3 | Regular (without progressive discovery) | PASS | ₦1.48 | 844 | 1 | passed | passed | results/openai_gpt-5.4-mini/scenario-3-regular-465ea4c37ce8.json |
| 2026-04-20T16:09:38.527Z | 2 | Regular (without progressive discovery) | PASS | ₦1.19 | 471 | 1 | passed | passed | results/openai_gpt-5.4-mini/scenario-2-regular-4f53d3c21bb6.json |
| 2026-04-20T16:09:32.571Z | 1 | Regular (without progressive discovery) | FAIL | ₦1.96 | 1,587 | 1 | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-1-regular-08f486068eb5.json |
| 2026-04-20T13:53:19.451Z | 6 | Code Mode (full API context) | FAIL | ₦1.24 | 1,193 | 1 | schema:false; expected-result:false | Output format did not match the required schema. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-6-code-mode-a245a0609e78.json |
| 2026-04-20T13:53:04.497Z | 6 | Regular (with progressive discovery) | FAIL | ₦0.58 | 452 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4-mini/scenario-6-regular-a245a0609e78.json |
| 2026-04-20T13:52:57.848Z | 5 | Code Mode (full API context) | PASS | ₦0.52 | 480 | 1 | passed | passed | results/openai_gpt-5.4-mini/scenario-5-code-mode-caec58c8367f.json |
| 2026-04-20T13:52:53.064Z | 5 | Regular (with progressive discovery) | FAIL | ₦0.66 | 509 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4-mini/scenario-5-regular-caec58c8367f.json |
| 2026-04-20T13:52:44.949Z | 4 | Code Mode (full API context) | FAIL | ₦1.13 | 1,089 | 1 | expected-result:false | Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-4-code-mode-955144330194.json |
| 2026-04-20T13:52:33.288Z | 4 | Regular (with progressive discovery) | PASS | ₦2.28 | 1,319 | 2 | passed | passed | results/openai_gpt-5.4-mini/scenario-4-regular-955144330194.json |
| 2026-04-20T13:52:22.078Z | 3 | Code Mode (full API context) | FAIL | ₦3.20 | 1,847 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4-mini/scenario-3-code-mode-1a7e8839e603.json |
| 2026-04-20T13:52:00.186Z | 3 | Regular (with progressive discovery) | FAIL | ₦2.24 | 1,391 | 2 | tool:channel-summary; schema:false; expected-result:false | Tool step failed: did not summarize the Slack channel correctly. Output format did not match the required schema. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-3-regular-1a7e8839e603-1.json |
| 2026-04-20T13:49:33.954Z | 3 | Regular (with progressive discovery) | PASS | ₦2.30 | 1,401 | 2 | passed | passed | results/openai_gpt-5.4-mini/scenario-3-regular-1a7e8839e603.json |
| 2026-04-20T13:49:22.059Z | 2 | Code Mode (full API context) | FAIL | ₦4.61 | 2,520 | 1 | Provider returned error | Provider/network issue prevented a usable model response. | results/openai_gpt-5.4-mini/scenario-2-code-mode-ca2d2187221a.json |
| 2026-04-20T13:49:00.649Z | 2 | Regular (with progressive discovery) | PASS | ₦1.71 | 873 | 2 | passed | passed | results/openai_gpt-5.4-mini/scenario-2-regular-ca2d2187221a.json |
| 2026-04-20T13:48:51.318Z | 1 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-13T13:48:50.467Z,2026-04-20T13:48:50.467Z,50000 | Scenario database query failed before the run could be evaluated. | results/openai_gpt-5.4-mini/scenario-1-code-mode-8a48076037be.json |
| 2026-04-20T13:48:48.077Z | 1 | Regular (with progressive discovery) | FAIL | ₦7.15 | 6,606 | 2 | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/openai_gpt-5.4-mini/scenario-1-regular-8a48076037be.json |

