# anthropic/claude-opus-4.6

Official FX conversion in this report uses the official CBN NFEM weighted average rate as at April-20-2026.

## Summary

| Paradigm | Best Passes | Covered Scenarios (max 6) | Best Pass Rate | Recorded Runs | Avg Input Tokens / Run | Avg Output Tokens / Run | Avg Total Tokens / Run | Avg Cost / Run (NGN) | Avg API Calls / Run | Attempts / Covered Scenario | Non-model Fail Runs | Benchmark/Model Fail Runs | Avg Recovery Cost (NGN) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 3/6 | 6/6 | 50.0% | 15 | 7,312 | 528 | 7,840 | ₦35.36 | 2.00 | 2.50 | 0 | 3 | n/a |
| Regular (without progressive discovery) | 5/6 | 6/6 | 83.3% | 6 | 2,451 | 472 | 2,922 | ₦17.81 | 1.00 | 1.00 | 0 | 1 | n/a |
| Code Mode | 6/6 | 6/6 | 100.0% | 16 | 2,111 | 194 | 2,305 | ₦11.05 | 1.00 | 2.67 | 0 | 0 | n/a |

## Failure Analysis (All Recorded Rounds)

Total rounds: **37**
Failed rounds: **15**

| Paradigm | Recorded Rounds | Failed Rounds | Failure Rate | Non-model Failures | Benchmark/Model Failures |
|---|---:|---:|---:|---:|---:|
| Regular (with progressive discovery) | 15 | 11 | 73.3% | 2 | 9 |
| Regular (without progressive discovery) | 6 | 1 | 16.7% | 0 | 1 |
| Code Mode | 16 | 3 | 18.8% | 3 | 0 |

| Failure Reason | Count | Scenarios | Paradigms | Human-readable reason | Latest Example File |
|---|---:|---|---|---|---|
| tool:progressive-discovery; schema:false | 5 | 2,3,6 | Regular (with progressive discovery) | Tool step failed: did not discover required tools first. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-6-regular-465d87a69fd4.json |
| Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | 5 | 4,5,6 | Code Mode, Regular (with progressive discovery) | Provider/network issue prevented a usable model response. | results/anthropic_claude-opus-4.6/scenario-6-code-mode-3b0383cfadec-1.json |
| tool:slot-proposal; schema:false | 2 | 5 | Regular (with progressive discovery) | Tool step failed: failed tool group: slot-proposal. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-5-regular-26f6e2a8d5c4.json |
| tool:customer-source,transaction-window,stats; expected-result:false | 1 | 1 | Regular (without progressive discovery) | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/anthropic_claude-opus-4.6/scenario-1-regular-3a6a0f620d37.json |
| tool:slot-proposal; schema:false; expected-result:false | 1 | 5 | Regular (with progressive discovery) | Tool step failed: failed tool group: slot-proposal. Output format did not match the required schema. Output content did not match the expected answer. | results/anthropic_claude-opus-4.6/scenario-5-regular-fe9f59e2bd91.json |
| tool:progressive-discovery | 1 | 4 | Regular (with progressive discovery) | Tool step failed: did not discover required tools first. | results/anthropic_claude-opus-4.6/scenario-4-regular-f04836145731.json |

## Best Historical Scenario Outcomes

| Scenario | Paradigm | Best Outcome | Failure Detail | Failure Reason (Simple) | Representative Cost (NGN) | Representative Tokens | Representative File |
|---|---|---|---|---|---:|---:|---|
| 1 | Regular (with progressive discovery) | PASS | passed | passed | ₦110.31 | 30,767 | results/anthropic_claude-opus-4.6/scenario-1-regular-68b1da287371.json |
| 1 | Regular (without progressive discovery) | FAIL | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | ₦35.00 | 9,412 | results/anthropic_claude-opus-4.6/scenario-1-regular-3a6a0f620d37.json |
| 1 | Code Mode | PASS | passed | passed | ₦9.43 | 1,850 | results/anthropic_claude-opus-4.6/scenario-1-code-mode-68b1da287371.json |
| 2 | Regular (with progressive discovery) | PASS | passed | passed | ₦27.26 | 3,305 | results/anthropic_claude-opus-4.6/scenario-2-regular-8adf617e5971.json |
| 2 | Regular (without progressive discovery) | PASS | passed | passed | ₦22.15 | 1,901 | results/anthropic_claude-opus-4.6/scenario-2-regular-bbede929fddf.json |
| 2 | Code Mode | PASS | passed | passed | ₦12.57 | 2,680 | results/anthropic_claude-opus-4.6/scenario-2-code-mode-8adf617e5971.json |
| 3 | Regular (with progressive discovery) | FAIL | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | ₦24.10 | 3,956 | results/anthropic_claude-opus-4.6/scenario-3-regular-e9b0f3e067ff.json |
| 3 | Regular (without progressive discovery) | PASS | passed | passed | ₦16.29 | 2,024 | results/anthropic_claude-opus-4.6/scenario-3-regular-6e7fde7dbe60.json |
| 3 | Code Mode | PASS | passed | passed | ₦9.67 | 1,536 | results/anthropic_claude-opus-4.6/scenario-3-code-mode-e9b0f3e067ff.json |
| 4 | Regular (with progressive discovery) | PASS | passed | passed | ₦19.46 | 3,229 | results/anthropic_claude-opus-4.6/scenario-4-regular-dfb1b3549e8d.json |
| 4 | Regular (without progressive discovery) | PASS | passed | passed | ₦11.41 | 1,407 | results/anthropic_claude-opus-4.6/scenario-4-regular-6b91cd0f906e.json |
| 4 | Code Mode | PASS | passed | passed | ₦12.78 | 2,962 | results/anthropic_claude-opus-4.6/scenario-4-code-mode-f04836145731.json |
| 5 | Regular (with progressive discovery) | FAIL | tool:slot-proposal; schema:false; expected-result:false | Tool step failed: failed tool group: slot-proposal. Output format did not match the required schema. Output content did not match the expected answer. | ₦12.36 | 2,669 | results/anthropic_claude-opus-4.6/scenario-5-regular-fe9f59e2bd91.json |
| 5 | Regular (without progressive discovery) | PASS | passed | passed | ₦11.52 | 1,423 | results/anthropic_claude-opus-4.6/scenario-5-regular-535f12c0446e.json |
| 5 | Code Mode | PASS | passed | passed | ₦15.76 | 3,261 | results/anthropic_claude-opus-4.6/scenario-5-code-mode-26f6e2a8d5c4.json |
| 6 | Regular (with progressive discovery) | FAIL | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | ₦18.68 | 3,116 | results/anthropic_claude-opus-4.6/scenario-6-regular-3b0383cfadec.json |
| 6 | Regular (without progressive discovery) | PASS | passed | passed | ₦10.51 | 1,365 | results/anthropic_claude-opus-4.6/scenario-6-regular-9066d034612b.json |
| 6 | Code Mode | PASS | passed | passed | ₦6.08 | 1,538 | results/anthropic_claude-opus-4.6/scenario-6-code-mode-465d87a69fd4.json |

## Run History

| Finished At | Scenario | Paradigm | Outcome | Cost (NGN) | Total Tokens | API Calls | Failure Detail | Failure Reason (Simple) | File |
|---|---:|---|---|---:|---:|---:|---|---|---|
| 2026-04-20T14:53:11.742Z | 6 | Regular (without progressive discovery) | PASS | ₦10.51 | 1,365 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-6-regular-9066d034612b.json |
| 2026-04-20T14:53:01.019Z | 5 | Regular (without progressive discovery) | PASS | ₦11.52 | 1,423 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-5-regular-535f12c0446e.json |
| 2026-04-20T14:52:36.107Z | 4 | Regular (without progressive discovery) | PASS | ₦11.41 | 1,407 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-4-regular-6b91cd0f906e.json |
| 2026-04-20T14:52:24.362Z | 3 | Regular (without progressive discovery) | PASS | ₦16.29 | 2,024 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-3-regular-6e7fde7dbe60.json |
| 2026-04-20T14:52:05.318Z | 2 | Regular (without progressive discovery) | PASS | ₦22.15 | 1,901 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-2-regular-bbede929fddf.json |
| 2026-04-20T14:51:39.945Z | 1 | Regular (without progressive discovery) | FAIL | ₦35.00 | 9,412 | 1 | tool:customer-source,transaction-window,stats; expected-result:false | Tool step failed: did not fetch customer data correctly; did not fetch the required transaction window; did not compute spend statistics correctly. Output content did not match the expected answer. | results/anthropic_claude-opus-4.6/scenario-1-regular-3a6a0f620d37.json |
| 2026-04-20T14:25:06.096Z | 5 | Code Mode | PASS | ₦16.98 | 3,352 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-5-code-mode-fe9f59e2bd91.json |
| 2026-04-20T14:24:32.666Z | 5 | Regular (with progressive discovery) | FAIL | ₦12.36 | 2,669 | 2 | tool:slot-proposal; schema:false; expected-result:false | Tool step failed: failed tool group: slot-proposal. Output format did not match the required schema. Output content did not match the expected answer. | results/anthropic_claude-opus-4.6/scenario-5-regular-fe9f59e2bd91.json |
| 2026-04-16T15:32:42.806Z | 6 | Code Mode | PASS | ₦6.08 | 1,538 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-6-code-mode-465d87a69fd4.json |
| 2026-04-16T15:32:22.795Z | 6 | Regular (with progressive discovery) | FAIL | ₦18.75 | 3,108 | 2 | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-6-regular-465d87a69fd4.json |
| 2026-04-16T15:31:55.789Z | 5 | Code Mode | PASS | ₦15.76 | 3,261 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-5-code-mode-26f6e2a8d5c4.json |
| 2026-04-16T15:31:22.138Z | 5 | Regular (with progressive discovery) | FAIL | ₦12.36 | 2,669 | 2 | tool:slot-proposal; schema:false | Tool step failed: failed tool group: slot-proposal. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-5-regular-26f6e2a8d5c4.json |
| 2026-04-16T15:31:06.935Z | 4 | Code Mode | PASS | ₦12.78 | 2,962 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-4-code-mode-f04836145731.json |
| 2026-04-16T15:30:42.128Z | 4 | Regular (with progressive discovery) | FAIL | ₦19.45 | 3,228 | 2 | tool:progressive-discovery | Tool step failed: did not discover required tools first. | results/anthropic_claude-opus-4.6/scenario-4-regular-f04836145731.json |
| 2026-04-16T15:30:19.429Z | 3 | Code Mode | PASS | ₦10.86 | 1,595 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-3-code-mode-ba34e868d18b.json |
| 2026-04-16T15:29:30.176Z | 3 | Regular (with progressive discovery) | FAIL | ₦24.17 | 3,962 | 2 | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-3-regular-ba34e868d18b.json |
| 2026-04-16T15:29:08.194Z | 2 | Code Mode | PASS | ₦28.04 | 3,809 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-2-code-mode-eebe0d617fe4.json |
| 2026-04-16T15:28:21.738Z | 2 | Regular (with progressive discovery) | FAIL | ₦23.96 | 3,132 | 2 | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-2-regular-eebe0d617fe4.json |
| 2026-04-16T15:27:54.337Z | 1 | Code Mode | PASS | ₦9.43 | 1,850 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-1-code-mode-68b1da287371.json |
| 2026-04-16T15:27:29.580Z | 1 | Regular (with progressive discovery) | PASS | ₦110.31 | 30,767 | 2 | passed | passed | results/anthropic_claude-opus-4.6/scenario-1-regular-68b1da287371.json |
| 2026-04-15T22:37:04.528Z | 6 | Code Mode | PASS | ₦6.08 | 1,538 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-6-code-mode-3b0383cfadec.json |
| 2026-04-15T22:36:56.277Z | 6 | Regular (with progressive discovery) | FAIL | ₦18.68 | 3,116 | 2 | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-6-regular-3b0383cfadec.json |
| 2026-04-15T22:36:18.773Z | 5 | Code Mode | PASS | ₦19.10 | 3,280 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-5-code-mode-bcec74aec51e.json |
| 2026-04-15T22:35:46.391Z | 5 | Regular (with progressive discovery) | FAIL | ₦12.80 | 2,698 | 2 | tool:slot-proposal; schema:false | Tool step failed: failed tool group: slot-proposal. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-5-regular-bcec74aec51e-1.json |
| 2026-04-15T22:35:23.729Z | 4 | Code Mode | PASS | ₦27.89 | 6,290 | 2 | passed | passed | results/anthropic_claude-opus-4.6/scenario-4-code-mode-dfb1b3549e8d-1.json |
| 2026-04-15T15:59:57.910Z | 6 | Code Mode | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/anthropic_claude-opus-4.6/scenario-6-code-mode-3b0383cfadec-1.json |
| 2026-04-15T15:59:57.447Z | 6 | Regular (with progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/anthropic_claude-opus-4.6/scenario-6-regular-3b0383cfadec-1.json |
| 2026-04-15T15:59:56.926Z | 5 | Code Mode | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/anthropic_claude-opus-4.6/scenario-5-code-mode-bcec74aec51e-1.json |
| 2026-04-15T15:59:56.490Z | 5 | Regular (with progressive discovery) | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/anthropic_claude-opus-4.6/scenario-5-regular-bcec74aec51e.json |
| 2026-04-15T15:59:56.031Z | 4 | Code Mode | FAIL | ₦0.00 | 0 | 0 | Unexpected HTTP client error: Error: Unable to connect. Is the computer able to access the url? | Provider/network issue prevented a usable model response. | results/anthropic_claude-opus-4.6/scenario-4-code-mode-dfb1b3549e8d.json |
| 2026-04-14T18:24:30.418Z | 4 | Regular (with progressive discovery) | PASS | ₦19.46 | 3,229 | 2 | passed | passed | results/anthropic_claude-opus-4.6/scenario-4-regular-dfb1b3549e8d.json |
| 2026-04-14T18:24:09.396Z | 3 | Code Mode | PASS | ₦9.67 | 1,536 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-3-code-mode-e9b0f3e067ff.json |
| 2026-04-14T18:23:53.081Z | 3 | Regular (with progressive discovery) | FAIL | ₦24.10 | 3,956 | 2 | tool:progressive-discovery; schema:false | Tool step failed: did not discover required tools first. Output format did not match the required schema. | results/anthropic_claude-opus-4.6/scenario-3-regular-e9b0f3e067ff.json |
| 2026-04-14T18:23:30.442Z | 2 | Code Mode | PASS | ₦12.57 | 2,680 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-2-code-mode-8adf617e5971.json |
| 2026-04-14T18:23:03.480Z | 2 | Regular (with progressive discovery) | PASS | ₦27.26 | 3,305 | 2 | passed | passed | results/anthropic_claude-opus-4.6/scenario-2-regular-8adf617e5971.json |
| 2026-04-14T18:22:28.831Z | 1 | Code Mode | PASS | ₦11.22 | 2,404 | 1 | passed | passed | results/anthropic_claude-opus-4.6/scenario-1-code-mode-6cebec045de6.json |
| 2026-04-14T18:21:13.765Z | 1 | Regular (with progressive discovery) | PASS | ₦144.27 | 39,967 | 3 | passed | passed | results/anthropic_claude-opus-4.6/scenario-1-regular-6cebec045de6.json |

