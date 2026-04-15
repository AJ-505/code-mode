# Benchmark Results: Regular vs Code Mode

Using the paired runs listed in `results/.scenario-pairs.json` where **both** regular and code-mode logs exist (**33 paired comparisons**), **Code Mode is the overall winner**.

| Paradigm | Input Tokens | Output Tokens | Total Tokens | Total Price (USD) | Tests Right | Tests Wrong | Pass Rate |
|---|---:|---:|---:|---:|---:|---:|---:|
| Regular | 196,904 | 16,419 | 213,323 | $0.601753 | 14 | 19 | 42.4% |
| Code Mode | 82,298 | 19,030 | 101,328 | $0.431312 | 27 | 6 | 81.8% |

| Savings vs Regular (Code Mode) | Value |
|---|---:|
| Input token savings | **58.2%** fewer |
| Output token savings | **-15.9%** (higher output) |
| Total token savings | **52.5%** fewer |
| Price savings | **28.3%** cheaper |

## Test Strengths by Scenario

| Scenario | Benchmark | Regular (Right/Wrong) | Code Mode (Right/Wrong) | Better |
|---:|---|---:|---:|---|
| 1 | `1_customer_db_average_spend` | 4 / 0 | 3 / 1 | Regular |
| 2 | `2_playwright_ui_audit` | 3 / 2 | 3 / 2 | Tie |
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
| `moonshotai/kimi-k2.5` | 5,854 / 1,546, $0.004900, 1 / 4 | 15,641 / 1,449, $0.008479, 4 / 1 | **Code Mode** | Much higher cost/tokens in code mode, but much stronger accuracy. |
| `openai/gpt-5.4` | 4,445 / 489, $0.018448, 0 / 4 | 4,674 / 24, $0.012045, 4 / 0 | **Code Mode** | Slightly higher input, but dramatic output/cost drop and perfect pass rate. |
| `z-ai/glm-5.1` | 43,642 / 3,263, $0.022315, 3 / 3 | 10,908 / 896, $0.006237, 6 / 0 | **Code Mode** | Clear sweep: better quality + far lower cost/tokens. |

## False-Positive Check

Deep scan across **142 result JSON files** found **no clear false positives** (no status/`didFailTest`/`overallPass` contradictions, and no pass records with failed required schema/tool checks).

## Overall Winner

**Code Mode**

### Why?

It delivered a much higher pass rate (**81.8% vs 42.4%**) while also cutting total tokens (**-52.5%**) and total spend (**-28.3%**), winning 4 of 6 scenarios (with 1 tie), and winning 5 of 6 models overall.
