# Benchmark Results: Regular vs Code Mode


| Paradigm | Input Tokens | Output Tokens | Total Tokens | Total Price (USD) | Tests Right | Tests Wrong | Pass Rate |
|---|---:|---:|---:|---:|---:|---:|---:|
| Regular | 198,729 | 16,704 | 215,433 | $0.604042 | 14 | 22 | 38.9% |
| Code Mode | 85,409 | 19,097 | 104,506 | $0.436276 | 29 | 7 | 80.6% |

| Savings vs Regular (Code Mode) | Value |
|---|---:|
| Input token savings | **57.0%** fewer |
| Output token savings | **-14.3%** (higher output) |
| Total token savings | **51.5%** fewer |
| Price savings | **27.8%** cheaper |

## Test Strengths by Scenario

| Scenario | Benchmark | Regular (Right/Wrong) | Code Mode (Right/Wrong) | Better |
|---:|---|---:|---:|---|
| 1 | `1_customer_db_average_spend` | 4 / 2 | 4 / 2 | Tie |
| 2 | `2_playwright_ui_audit` | 3 / 3 | 4 / 2 | Code Mode |
| 3 | `3_slack_summary` | 0 / 6 | 5 / 1 | Code Mode |
| 4 | `4_drive_keyword_retrieval` | 2 / 4 | 6 / 0 | Code Mode |
| 5 | `5_calendar_timezone_scheduling` | 1 / 5 | 5 / 1 | Code Mode |
| 6 | `6_github_repo_change_pr` | 4 / 2 | 5 / 1 | Code Mode |

## Per-Model Comparison

| Model | Regular (In/Out, Price, Right/Wrong) | Code Mode (In/Out, Price, Right/Wrong) | Winner | Notable finding |
|---|---|---|---|---|
| `anthropic/claude-opus-4.6` | 52,910 / 3,361, $0.202498, 3 / 3 | 16,145 / 1,583, $0.098808, 6 / 0 | **Code Mode** | Better on every axis (accuracy, tokens, price). |
| `anthropic/claude-sonnet-4.6` | 46,816 / 3,458, $0.188339, 2 / 4 | 29,227 / 4,610, $0.151363, 5 / 1 | **Code Mode** | Accuracy jump outweighed higher output tokens. |
| `google/gemini-3.1-pro-preview` | 43,237 / 4,302, $0.165253, 5 / 1 | 5,703 / 10,468, $0.154380, 2 / 4 | **Regular** | Code mode cut input heavily, but output ballooned and quality dropped. |
| `moonshotai/kimi-k2.5` | 7,304 / 1,808, $0.005906, 1 / 5 | 17,068 / 1,509, $0.009128, 5 / 1 | **Code Mode** | Higher cost/tokens in code mode, but large quality lift (5 vs 1 passes). |
| `openai/gpt-5.4` | 4,820 / 512, $0.019731, 0 / 6 | 6,358 / 31, $0.016360, 5 / 1 | **Code Mode** | Strong quality and output-token gains.|
| `z-ai/glm-5.1` | 43,642 / 3,263, $0.022315, 3 / 3 | 10,908 / 896, $0.006237, 6 / 0 | **Code Mode** | Clear sweep: better quality + far lower cost/tokens. |

## Overall Winner

**Code Mode**

### Why?

It delivered a much higher pass rate (**80.6% vs 38.9%**) while also cutting total tokens (**-51.5%**) and total spend (**-27.8%**), winning 4 of 6 scenarios (with 1 tie), and winning 5 of 6 models overall.
