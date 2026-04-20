# anthropic/claude-sonnet-4.6

Official FX conversion in this report uses the official CBN NFEM weighted average rate as at April-20-2026.

## Summary

| Paradigm | Best Passes | Covered Scenarios (max 6) | Best Pass Rate | Recorded Runs | Avg Input Tokens / Run | Avg Output Tokens / Run | Avg Total Tokens / Run | Avg Cost / Run (NGN) | Avg API Calls / Run | Attempts / Covered Scenario | Non-model Fail Runs | Benchmark/Model Fail Runs | Avg Recovery Cost (NGN) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 2/6 | 6/6 | 33.3% | 10 | 7,803 | 576 | 8,379 | ₦38.00 | 2.00 | 1.67 | 0 | 4 | n/a |
| Regular (without progressive discovery) | 3/6 | 6/6 | 50.0% | 6 | 2,467 | 513 | 2,981 | ₦18.72 | 1.00 | 1.00 | 0 | 3 | n/a |
| Code Mode (progressive API discovery) | 4/6 | 6/6 | 66.7% | 12 | 1,537 | 354 | 1,891 | ₦12.35 | 0.83 | 2.00 | 0 | 2 | ₦43.44 |
| Code Mode (full API context) | 5/6 | 6/6 | 83.3% | 9 | 4,871 | 768 | 5,640 | ₦31.99 | 2.00 | 1.50 | 0 | 1 | n/a |

## Best Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 6 | 33.3% | 7,803 | 576 | 8,379 | ₦38.00 | 2.00 | 15,092 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 50.0% | 2,467 | 513 | 2,981 | ₦18.72 | 1.00 | 20,984 ms | 0.00 |
| Code Mode (progressive API discovery) | 6 | 66.7% | 1,537 | 354 | 1,891 | ₦12.35 | 0.83 | 18,119 ms | 0.00 |
| Code Mode (full API context) | 6 | 83.3% | 4,871 | 768 | 5,640 | ₦31.99 | 2.00 | 19,998 ms | 1.50 |

## Worst Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 6 | 16.7% | 2,196 | 466 | 2,662 | ₦16.85 | 1.67 | 11,764 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 50.0% | 2,467 | 513 | 2,981 | ₦18.72 | 1.00 | 20,984 ms | 0.00 |
| Code Mode (progressive API discovery) | 6 | 33.3% | 3,853 | 464 | 4,317 | ₦22.40 | 1.50 | 17,803 ms | 1.00 |
| Code Mode (full API context) | 6 | 83.3% | 4,871 | 768 | 5,640 | ₦31.99 | 2.00 | 19,998 ms | 1.50 |

## Average Case (Per Model + Paradigm)

Excludes network/provider failures and known false positives.

| Paradigm | Runs Used | Pass Rate | Input Tokens | Output Tokens | Total Tokens | Cost (NGN) | Network Round-Trips | Network Latency / Round-Trip | Failure-Related Retries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 8 | 25.0% | 5,852 | 432 | 6,284 | ₦28.50 | 1.50 | 15,092 ms | 0.00 |
| Regular (without progressive discovery) | 6 | 50.0% | 2,467 | 513 | 2,981 | ₦18.72 | 1.00 | 20,984 ms | 0.00 |
| Code Mode (progressive API discovery) | 12 | 33.3% | 2,553 | 349 | 2,902 | ₦15.69 | 1.08 | 17,540 ms | 0.50 |
| Code Mode (full API context) | 6 | 83.3% | 4,871 | 768 | 5,640 | ₦31.99 | 2.00 | 19,998 ms | 1.50 |

## Recovery Benchmarks

Lower is better for retries, cost, and time.

| Paradigm | Recovered Cases | Avg Retries To Recover | Avg Recovery Cost (NGN) | Avg Recovery Time |
|---|---:|---:|---:|---:|
| Regular (with progressive discovery) | 0 | n/a | n/a | n/a |
| Regular (without progressive discovery) | 0 | n/a | n/a | n/a |
| Code Mode (progressive API discovery) | 2 | 1.00 | ₦43.44 | 4,307,805 ms |
| Code Mode (full API context) | 0 | n/a | n/a | n/a |

## Failure Analysis (All Recorded Rounds)

Total rounds: **43**
Failed rounds: **29**

| Paradigm | Recorded Rounds | Failed Rounds | Failure Rate | Non-model Failures | Benchmark/Model Failures |
|---|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 10 | 8 | 80.0% | 2 | 6 |
| Regular (without progressive discovery) | 6 | 3 | 50.0% | 0 | 3 |
| Code Mode (progressive API discovery) | 18 | 14 | 77.8% | 0 | 14 |
| Code Mode (full API context) | 9 | 4 | 44.4% | 3 | 1 |

| Failure Reason | Count | Scenarios | Paradigms | Human-readable reason | Latest Example File |
|---|---:|---|---|---|---|
| tool:api-definition-search | 6 | 2,3,4,5 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-sonnet-4.6/scenario-5-code-mode-76f13e3fdafb-1.json |
| No transactions found in the last 7 days. Run the seed script first. | 3 | 1 | Code Mode (progressive API discovery) | Run failed due to benchmark/model mismatch. | results/anthropic_claude-sonnet-4.6/scenario-1-code-mode-8ea253e68b56-2.json |
| tool:api-definition-search; expected-result:false | 2 | 6 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search. Output content did not match the expected answer. | results/anthropic_claude-sonnet-4.6/scenario-6-code-mode-96eb6b0a9755-1.json |
| tool:progressive-discovery; schema:false | 2 | 2,5 | Regular (with progressive discovery) | Tool step failed: did not discover required tools first. Output format did not match the required schema. | results/anthropic_claude-sonnet-4.6/scenario-5-regular-7d4780dfd05e-1.json |
| Timeout while waiting for code_mode response after 120000ms | 2 | 4,5 | Code Mode (full API context) | Provider/network issue prevented a usable model response. | results/anthropic_claude-sonnet-4.6/scenario-5-code-mode-7d4780dfd05e-1.json |
| expected-result:false | 1 | 6 | Code Mode (progressive API discovery) | Output content did not match the expected answer. | results/anthropic_claude-sonnet-4.6/scenario-6-code-mode-96eb6b0a9755-2.json |
| tool:api-definition-search; schema:false; expected-result:false | 1 | 5 | Code Mode (progressive API discovery) | Tool step failed: failed tool group: api-definition-search. Output format did not match the required schema. Output content did not match the expected answer. | results/anthropic_claude-sonnet-4.6/scenario-5-code-mode-76f13e3fdafb.json |
| tool:code-execution; schema:false; expected-result:false | 1 | 3 | Code Mode (progressive API discovery) | Tool step failed: did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | results/anthropic_claude-sonnet-4.6/scenario-3-code-mode-171ea55b2020.json |
| tool:keyword-retrieval; schema:false; expected-result:false | 1 | 4 | Regular (without progressive discovery) | Tool step failed: did not retrieve keyword matches from Drive correctly. Output format did not match the required schema. Output content did not match the expected answer. | results/anthropic_claude-sonnet-4.6/scenario-4-regular-1485ceba6ac6.json |
| tool:site-inspection; schema:false; expected-result:false | 1 | 2 | Regular (without progressive discovery) | Tool step failed: did not inspect the target website as required. Output format did not match the required schema. Output content did not match the expected answer. | results/anthropic_claude-sonnet-4.6/scenario-2-regular-4d884cf94d37.json |
| tool:customer-source,transaction-window,stats; expected-result:false | 1 | 1 | Regular (without progressive discovery) | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/anthropic_claude-sonnet-4.6/scenario-1-regular-63171feb64c6.json |
| Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | 1 | 6 | Code Mode (full API context) | Provider/network issue prevented a usable model response. | results/anthropic_claude-sonnet-4.6/scenario-6-code-mode-918d04f0e1a2.json |
| Timeout while waiting for scenario6 regular discovery response after 120000ms | 1 | 6 | Regular (with progressive discovery) | Provider/network issue prevented a usable model response. | results/anthropic_claude-sonnet-4.6/scenario-6-regular-918d04f0e1a2.json |
| Timeout while waiting for scenario5 regular discovery response after 120000ms | 1 | 5 | Regular (with progressive discovery) | Provider/network issue prevented a usable model response. | results/anthropic_claude-sonnet-4.6/scenario-5-regular-7d4780dfd05e.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-08T15:51:50.971Z,2026-04-15T15:51:50.971Z,50000 | 1 | 1 | Regular (with progressive discovery) | Scenario database query failed before the run could be evaluated. | results/anthropic_claude-sonnet-4.6/scenario-1-regular-be0a4a3aa3dd-2.json |
| tool:progressive-discovery,keyword-retrieval; schema:false | 1 | 4 | Regular (with progressive discovery) | Tool step failed: did not discover required tools first; did not retrieve keyword matches from Drive correctly. Output format did not match the required schema. | results/anthropic_claude-sonnet-4.6/scenario-4-regular-bc97b8ee62aa.json |
| tool:code-execution; schema:false | 1 | 3 | Code Mode (full API context) | Tool step failed: did not execute the required code tool. Output format did not match the required schema. | results/anthropic_claude-sonnet-4.6/scenario-3-code-mode-76af516f69b8.json |
| tool:progressive-discovery,channel-summary; schema:false | 1 | 3 | Regular (with progressive discovery) | Tool step failed: did not discover required tools first; did not summarize the Slack channel correctly. Output format did not match the required schema. | results/anthropic_claude-sonnet-4.6/scenario-3-regular-76af516f69b8.json |
| Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:31:46.972Z,2026-04-14T18:31:46.972Z,50000 | 1 | 1 | Regular (with progressive discovery) | Scenario database query failed before the run could be evaluated. | results/anthropic_claude-sonnet-4.6/scenario-1-regular-be0a4a3aa3dd.json |

## Best Historical Scenario Outcomes

| Scenario | Paradigm | Best Outcome | Failure Detail | Failure Reason (Simple) | Representative Cost (NGN) | Representative Tokens | Representative File |
|---|---|---|---|---|---:|---:|---|
| 1 | Regular (with progressive discovery) | PASS | passed | passed | ₦126.90 | 34,303 | results/anthropic_claude-sonnet-4.6/scenario-1-regular-be0a4a3aa3dd-1.json |
| 1 | Regular (without progressive discovery) | FAIL | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | ₦40.90 | 9,966 | results/anthropic_claude-sonnet-4.6/scenario-1-regular-63171feb64c6.json |
| 1 | Code Mode (progressive API discovery) | FAIL | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | ₦0.00 | 0 | results/anthropic_claude-sonnet-4.6/scenario-1-code-mode-8ea253e68b56-2.json |
| 1 | Code Mode (full API context) | PASS | passed | passed | ₦12.67 | 2,791 | results/anthropic_claude-sonnet-4.6/scenario-1-code-mode-be0a4a3aa3dd.json |
| 2 | Regular (with progressive discovery) | FAIL | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | ₦24.50 | 3,095 | results/anthropic_claude-sonnet-4.6/scenario-2-regular-5cfcc329a8a4.json |
| 2 | Regular (without progressive discovery) | FAIL | tool:site-inspection; schema:false; expected-result:false | Tool step failed: did not inspect the target website as required. Output format did not match the required schema. Output content did not match the expected answer. | ₦23.90 | 1,979 | results/anthropic_claude-sonnet-4.6/scenario-2-regular-4d884cf94d37.json |
| 2 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦20.23 | 2,451 | results/anthropic_claude-sonnet-4.6/scenario-2-code-mode-6b98be8621ce-2.json |
| 2 | Code Mode (full API context) | PASS | passed | passed | ₦18.71 | 2,219 | results/anthropic_claude-sonnet-4.6/scenario-2-code-mode-5cfcc329a8a4.json |
| 3 | Regular (with progressive discovery) | FAIL | tool:progressive-discovery,channel-summary; schema:false | Tool step failed: did not discover required tools first; did not summarize the Slack channel correctly. Output format did not match the required schema. | ₦23.23 | 3,799 | results/anthropic_claude-sonnet-4.6/scenario-3-regular-76af516f69b8.json |
| 3 | Regular (without progressive discovery) | PASS | passed | passed | ₦18.35 | 2,124 | results/anthropic_claude-sonnet-4.6/scenario-3-regular-3e4e4990fb56.json |
| 3 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦14.77 | 2,341 | results/anthropic_claude-sonnet-4.6/scenario-3-code-mode-171ea55b2020-2.json |
| 3 | Code Mode (full API context) | FAIL | tool:code-execution; schema:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. | ₦44.07 | 7,830 | results/anthropic_claude-sonnet-4.6/scenario-3-code-mode-76af516f69b8.json |
| 4 | Regular (with progressive discovery) | FAIL | tool:progressive-discovery,keyword-retrieval; schema:false | Tool step failed: did not discover required tools first; did not retrieve keyword matches from Drive correctly. Output format did not match the required schema. | ₦17.57 | 2,963 | results/anthropic_claude-sonnet-4.6/scenario-4-regular-bc97b8ee62aa.json |
| 4 | Regular (without progressive discovery) | FAIL | tool:keyword-retrieval; schema:false; expected-result:false | Tool step failed: did not retrieve keyword matches from Drive correctly. Output format did not match the required schema. Output content did not match the expected answer. | ₦4.63 | 868 | results/anthropic_claude-sonnet-4.6/scenario-4-regular-1485ceba6ac6.json |
| 4 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦12.74 | 2,140 | results/anthropic_claude-sonnet-4.6/scenario-4-code-mode-e4cb5d8fc964-2.json |
| 4 | Code Mode (full API context) | PASS | passed | passed | ₦55.35 | 10,064 | results/anthropic_claude-sonnet-4.6/scenario-4-code-mode-bc97b8ee62aa.json |
| 5 | Regular (with progressive discovery) | FAIL | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | ₦17.68 | 3,114 | results/anthropic_claude-sonnet-4.6/scenario-5-regular-7d4780dfd05e-1.json |
| 5 | Regular (without progressive discovery) | PASS | passed | passed | ₦12.54 | 1,495 | results/anthropic_claude-sonnet-4.6/scenario-5-regular-93f9dc13ff4f.json |
| 5 | Code Mode (progressive API discovery) | PASS | passed | passed | ₦13.90 | 2,295 | results/anthropic_claude-sonnet-4.6/scenario-5-code-mode-76f13e3fdafb-2.json |
| 5 | Code Mode (full API context) | PASS | passed | passed | ₦12.23 | 1,589 | results/anthropic_claude-sonnet-4.6/scenario-5-code-mode-7d4780dfd05e.json |
| 6 | Regular (with progressive discovery) | PASS | passed | passed | ₦18.10 | 3,000 | results/anthropic_claude-sonnet-4.6/scenario-6-regular-918d04f0e1a2-1.json |
| 6 | Regular (without progressive discovery) | PASS | passed | passed | ₦11.99 | 1,452 | results/anthropic_claude-sonnet-4.6/scenario-6-regular-f40cd7ce3923.json |
| 6 | Code Mode (progressive API discovery) | FAIL | expected-result:false | Output content did not match the expected answer. | ₦12.45 | 2,119 | results/anthropic_claude-sonnet-4.6/scenario-6-code-mode-96eb6b0a9755-2.json |
| 6 | Code Mode (full API context) | PASS | passed | passed | ₦48.92 | 9,344 | results/anthropic_claude-sonnet-4.6/scenario-6-code-mode-918d04f0e1a2-1.json |

## Run History

| Finished At | Scenario | Paradigm | Outcome | Cost (NGN) | Total Tokens | API Calls | Failure Detail | Failure Reason (Simple) | File |
|---|---:|---|---|---:|---:|---:|---|---|---|
| 2026-04-20T18:44:52.083Z | 5 | Code Mode (progressive API discovery) | PASS | ₦13.90 | 2,295 | 1 | passed | passed | results/anthropic_claude-sonnet-4.6/scenario-5-code-mode-76f13e3fdafb-2.json |
| 2026-04-20T18:44:47.568Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦12.45 | 2,119 | 1 | expected-result:false | Output content did not match the expected answer. | results/anthropic_claude-sonnet-4.6/scenario-6-code-mode-96eb6b0a9755-2.json |
| 2026-04-20T18:44:44.190Z | 4 | Code Mode (progressive API discovery) | PASS | ₦12.74 | 2,140 | 1 | passed | passed | results/anthropic_claude-sonnet-4.6/scenario-4-code-mode-e4cb5d8fc964-2.json |
| 2026-04-20T18:44:43.509Z | 3 | Code Mode (progressive API discovery) | PASS | ₦14.77 | 2,341 | 1 | passed | passed | results/anthropic_claude-sonnet-4.6/scenario-3-code-mode-171ea55b2020-2.json |
| 2026-04-20T18:44:39.199Z | 2 | Code Mode (progressive API discovery) | PASS | ₦20.23 | 2,451 | 1 | passed | passed | results/anthropic_claude-sonnet-4.6/scenario-2-code-mode-6b98be8621ce-2.json |
| 2026-04-20T18:44:21.374Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/anthropic_claude-sonnet-4.6/scenario-1-code-mode-8ea253e68b56-2.json |
| 2026-04-20T18:39:27.758Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦14.56 | 2,439 | 1 | tool:api-definition-search; expected-result:false | Tool step failed: failed tool group: api-definition-search. Output content did not match the expected answer. | results/anthropic_claude-sonnet-4.6/scenario-6-code-mode-96eb6b0a9755-1.json |
| 2026-04-20T18:39:23.447Z | 5 | Code Mode (progressive API discovery) | FAIL | ₦13.35 | 2,181 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-sonnet-4.6/scenario-5-code-mode-76f13e3fdafb-1.json |
| 2026-04-20T18:39:16.329Z | 4 | Code Mode (progressive API discovery) | FAIL | ₦13.51 | 2,175 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-sonnet-4.6/scenario-4-code-mode-e4cb5d8fc964-1.json |
| 2026-04-20T18:39:16.253Z | 3 | Code Mode (progressive API discovery) | FAIL | ₦14.56 | 2,386 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-sonnet-4.6/scenario-3-code-mode-171ea55b2020-1.json |
| 2026-04-20T18:39:09.759Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦19.06 | 2,393 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-sonnet-4.6/scenario-2-code-mode-6b98be8621ce-1.json |
| 2026-04-20T18:38:52.477Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/anthropic_claude-sonnet-4.6/scenario-1-code-mode-8ea253e68b56-1.json |
| 2026-04-20T17:34:52.173Z | 6 | Code Mode (progressive API discovery) | FAIL | ₦12.73 | 2,168 | 1 | tool:api-definition-search; expected-result:false | Tool step failed: failed tool group: api-definition-search. Output content did not match the expected answer. | results/anthropic_claude-sonnet-4.6/scenario-6-code-mode-96eb6b0a9755.json |
| 2026-04-20T17:34:33.007Z | 5 | Code Mode (progressive API discovery) | FAIL | ₦47.27 | 10,253 | 3 | tool:api-definition-search; schema:false; expected-result:false | Tool step failed: failed tool group: api-definition-search. Output format did not match the required schema. Output content did not match the expected answer. | results/anthropic_claude-sonnet-4.6/scenario-5-code-mode-76f13e3fdafb.json |
| 2026-04-20T17:33:31.369Z | 4 | Code Mode (progressive API discovery) | FAIL | ₦12.06 | 2,144 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-sonnet-4.6/scenario-4-code-mode-e4cb5d8fc964.json |
| 2026-04-20T17:33:08.732Z | 3 | Code Mode (progressive API discovery) | FAIL | ₦39.62 | 8,621 | 3 | tool:code-execution; schema:false; expected-result:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. Output content did not match the expected answer. | results/anthropic_claude-sonnet-4.6/scenario-3-code-mode-171ea55b2020.json |
| 2026-04-20T17:32:23.305Z | 2 | Code Mode (progressive API discovery) | FAIL | ₦19.42 | 2,515 | 1 | tool:api-definition-search | Tool step failed: failed tool group: api-definition-search. | results/anthropic_claude-sonnet-4.6/scenario-2-code-mode-6b98be8621ce.json |
| 2026-04-20T17:31:54.672Z | 1 | Code Mode (progressive API discovery) | FAIL | ₦0.00 | 0 | 0 | No transactions found in the last 7 days. Run the seed script first. | Run failed due to benchmark/model mismatch. | results/anthropic_claude-sonnet-4.6/scenario-1-code-mode-8ea253e68b56.json |
| 2026-04-20T14:55:30.883Z | 6 | Regular (without progressive discovery) | PASS | ₦11.99 | 1,452 | 1 | passed | passed | results/anthropic_claude-sonnet-4.6/scenario-6-regular-f40cd7ce3923.json |
| 2026-04-20T14:55:02.984Z | 5 | Regular (without progressive discovery) | PASS | ₦12.54 | 1,495 | 1 | passed | passed | results/anthropic_claude-sonnet-4.6/scenario-5-regular-93f9dc13ff4f.json |
| 2026-04-20T14:54:44.530Z | 4 | Regular (without progressive discovery) | FAIL | ₦4.63 | 868 | 1 | tool:keyword-retrieval; schema:false; expected-result:false | Tool step failed: did not retrieve keyword matches from Drive correctly. Output format did not match the required schema. Output content did not match the expected answer. | results/anthropic_claude-sonnet-4.6/scenario-4-regular-1485ceba6ac6.json |
| 2026-04-20T14:54:31.076Z | 3 | Regular (without progressive discovery) | PASS | ₦18.35 | 2,124 | 1 | passed | passed | results/anthropic_claude-sonnet-4.6/scenario-3-regular-3e4e4990fb56.json |
| 2026-04-20T14:54:14.884Z | 2 | Regular (without progressive discovery) | FAIL | ₦23.90 | 1,979 | 1 | tool:site-inspection; schema:false; expected-result:false | Tool step failed: did not inspect the target website as required. Output format did not match the required schema. Output content did not match the expected answer. | results/anthropic_claude-sonnet-4.6/scenario-2-regular-4d884cf94d37.json |
| 2026-04-20T14:53:47.305Z | 1 | Regular (without progressive discovery) | FAIL | ₦40.90 | 9,966 | 1 | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/anthropic_claude-sonnet-4.6/scenario-1-regular-63171feb64c6.json |
| 2026-04-15T22:40:29.742Z | 6 | Code Mode (full API context) | PASS | ₦48.92 | 9,344 | 3 | passed | passed | results/anthropic_claude-sonnet-4.6/scenario-6-code-mode-918d04f0e1a2-1.json |
| 2026-04-15T22:39:49.433Z | 6 | Regular (with progressive discovery) | PASS | ₦18.10 | 3,000 | 2 | passed | passed | results/anthropic_claude-sonnet-4.6/scenario-6-regular-918d04f0e1a2-1.json |
| 2026-04-15T22:39:25.856Z | 5 | Code Mode (full API context) | PASS | ₦12.23 | 1,589 | 1 | passed | passed | results/anthropic_claude-sonnet-4.6/scenario-5-code-mode-7d4780dfd05e.json |
| 2026-04-15T22:39:08.166Z | 5 | Regular (with progressive discovery) | FAIL | ₦17.68 | 3,114 | 2 | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | results/anthropic_claude-sonnet-4.6/scenario-5-regular-7d4780dfd05e-1.json |
| 2026-04-15T22:38:49.128Z | 4 | Code Mode (full API context) | PASS | ₦55.35 | 10,064 | 3 | passed | passed | results/anthropic_claude-sonnet-4.6/scenario-4-code-mode-bc97b8ee62aa.json |
| 2026-04-15T22:38:09.105Z | 1 | Regular (with progressive discovery) | PASS | ₦126.90 | 34,303 | 2 | passed | passed | results/anthropic_claude-sonnet-4.6/scenario-1-regular-be0a4a3aa3dd-1.json |
| 2026-04-15T15:59:55.571Z | 6 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/anthropic_claude-sonnet-4.6/scenario-6-code-mode-918d04f0e1a2.json |
| 2026-04-15T15:59:54.863Z | 6 | Regular (with progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Timeout while waiting for scenario6 regular discovery response after 120000ms | Provider/network issue prevented a usable model response. | results/anthropic_claude-sonnet-4.6/scenario-6-regular-918d04f0e1a2.json |
| 2026-04-15T15:57:54.142Z | 5 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Timeout while waiting for code_mode response after 120000ms | Provider/network issue prevented a usable model response. | results/anthropic_claude-sonnet-4.6/scenario-5-code-mode-7d4780dfd05e-1.json |
| 2026-04-15T15:55:53.291Z | 5 | Regular (with progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Timeout while waiting for scenario5 regular discovery response after 120000ms | Provider/network issue prevented a usable model response. | results/anthropic_claude-sonnet-4.6/scenario-5-regular-7d4780dfd05e.json |
| 2026-04-15T15:53:52.623Z | 4 | Code Mode (full API context) | FAIL | ₦0.00 | 0 | 0 | Timeout while waiting for code_mode response after 120000ms | Provider/network issue prevented a usable model response. | results/anthropic_claude-sonnet-4.6/scenario-4-code-mode-bc97b8ee62aa-1.json |
| 2026-04-15T15:51:51.785Z | 1 | Regular (with progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-08T15:51:50.971Z,2026-04-15T15:51:50.971Z,50000 | Scenario database query failed before the run could be evaluated. | results/anthropic_claude-sonnet-4.6/scenario-1-regular-be0a4a3aa3dd-2.json |
| 2026-04-14T18:35:05.691Z | 4 | Regular (with progressive discovery) | FAIL | ₦17.57 | 2,963 | 2 | tool:progressive-discovery,keyword-retrieval; schema:false | Tool step failed: did not discover required tools first; did not retrieve keyword matches from Drive correctly. Output format did not match the required schema. | results/anthropic_claude-sonnet-4.6/scenario-4-regular-bc97b8ee62aa.json |
| 2026-04-14T18:34:46.215Z | 3 | Code Mode (full API context) | FAIL | ₦44.07 | 7,830 | 3 | tool:code-execution; schema:false | Tool step failed: did not execute the required code tool. Output format did not match the required schema. | results/anthropic_claude-sonnet-4.6/scenario-3-code-mode-76af516f69b8.json |
| 2026-04-14T18:34:06.383Z | 3 | Regular (with progressive discovery) | FAIL | ₦23.23 | 3,799 | 2 | tool:progressive-discovery,channel-summary; schema:false | Tool step failed: did not discover required tools first; did not summarize the Slack channel correctly. Output format did not match the required schema. | results/anthropic_claude-sonnet-4.6/scenario-3-regular-76af516f69b8.json |
| 2026-04-14T18:33:24.777Z | 2 | Code Mode (full API context) | PASS | ₦18.71 | 2,219 | 1 | passed | passed | results/anthropic_claude-sonnet-4.6/scenario-2-code-mode-5cfcc329a8a4.json |
| 2026-04-14T18:32:59.826Z | 2 | Regular (with progressive discovery) | FAIL | ₦24.50 | 3,095 | 2 | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | results/anthropic_claude-sonnet-4.6/scenario-2-regular-5cfcc329a8a4.json |
| 2026-04-14T18:32:30.599Z | 1 | Code Mode (full API context) | PASS | ₦12.67 | 2,791 | 1 | passed | passed | results/anthropic_claude-sonnet-4.6/scenario-1-code-mode-be0a4a3aa3dd.json |
| 2026-04-14T18:31:47.845Z | 1 | Regular (with progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 params: 2026-04-07T18:31:46.972Z,2026-04-14T18:31:46.972Z,50000 | Scenario database query failed before the run could be evaluated. | results/anthropic_claude-sonnet-4.6/scenario-1-regular-be0a4a3aa3dd.json |

