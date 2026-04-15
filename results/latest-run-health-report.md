# Latest run health report

Generated from the latest JSON run artifact per `model + scenario + mode`, excluding removed models.

- Total latest runs: **76**
- Properly completed: **43**
- Improper/incomplete: **8**
- Benchmark failures: **25**

## Improper/incomplete latest runs

| Model | Scenario | Mode | Why | Latest file |
|---|---:|---|---|---|
| anthropic/opus-4.6 | 1 | regular | anthropic/opus-4.6 is not a valid model ID | `anthropic_opus-4.6-scenario-1-regular-pair-6592f2211a44-1b5a209645e2-2026-04-14T18-19-23.290Z.json` |
| anthropic/opus-4.99 | 1 | code-mode | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 | `anthropic_opus-4.99-scenario-1-code-mode-pair-1d98208264ee-bad4204675d6-2026-04-14T18-18-17.070Z.json` |
| anthropic/opus-4.99 | 1 | regular | anthropic/opus-4.99 is not a valid model ID | `anthropic_opus-4.99-scenario-1-regular-pair-1d98208264ee-0cd0d194fe71-2026-04-14T18-19-06.415Z.json` |
| anthropic/opus-4.99 | 2 | regular | anthropic/opus-4.99 is not a valid model ID | `anthropic_opus-4.99-scenario-2-regular-pair-be238b214d81-4312f23d7b63-2026-04-14T18-18-19.059Z.json` |
| moonshotai/kimi-k2.5 | 1 | regular | Timeout while waiting for regular execution response after 120000ms | `moonshotai_kimi-k2.5-scenario-1-regular-pair-0c7bb187ffe5-02c234a9af0b-2026-04-15T22-43-57.068Z.json` |
| openai/gpt-5.4 | 1 | code-mode | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 | `openai_gpt-5.4-scenario-1-code-mode-pair-1342a3c53494-6b2a3bc94655-2026-04-15T22-46-34.364Z.json` |
| openai/gpt-5.4 | 1 | regular | Failed query: select "id", "customer_id", "amount", "created_at" from "transactions" where ("transactions"."created_at" >= $1 and "transactions"."created_at" <= $2) order by "transactions"."created_at" asc limit $3 | `openai_gpt-5.4-scenario-1-regular-pair-1342a3c53494-580ad7ba6032-2026-04-15T22-46-32.982Z.json` |
| openai/gpt-5.4 | 2 | regular | Provider returned error | `openai_gpt-5.4-scenario-2-regular-pair-b74d97c3aa02-e5ad01bf20b0-2026-04-15T22-46-36.168Z.json` |

## Benchmark-failure latest runs

| Model | Scenario | Mode | Notes |
|---|---:|---|---|
| anthropic/claude-opus-4.6 | 3 | regular | toolPass=false, schemaPass=false, fuzzyPass=true |
| anthropic/claude-opus-4.6 | 5 | regular | toolPass=false, schemaPass=false, fuzzyPass=false |
| anthropic/claude-opus-4.6 | 6 | regular | toolPass=false, schemaPass=false, fuzzyPass=true |
| anthropic/claude-sonnet-4.6 | 2 | regular | toolPass=false, schemaPass=false, fuzzyPass=true |
| anthropic/claude-sonnet-4.6 | 3 | code-mode | toolPass=false, schemaPass=false, fuzzyPass=true |
| anthropic/claude-sonnet-4.6 | 3 | regular | toolPass=false, schemaPass=false, fuzzyPass=true |
| anthropic/claude-sonnet-4.6 | 4 | regular | toolPass=false, schemaPass=false, fuzzyPass=true |
| anthropic/claude-sonnet-4.6 | 5 | regular | toolPass=false, schemaPass=false, fuzzyPass=false |
| google/gemini-3.1-pro-preview | 1 | code-mode | toolPass=false, schemaPass=false, fuzzyPass=false |
| google/gemini-3.1-pro-preview | 2 | code-mode | toolPass=false, schemaPass=false, fuzzyPass=false |
| google/gemini-3.1-pro-preview | 3 | regular | toolPass=false, schemaPass=false, fuzzyPass=true |
| google/gemini-3.1-pro-preview | 5 | code-mode | toolPass=false, schemaPass=false, fuzzyPass=false |
| google/gemini-3.1-pro-preview | 6 | code-mode | toolPass=false, schemaPass=false, fuzzyPass=true |
| moonshotai/kimi-k2.5 | 2 | code-mode | toolPass=true, schemaPass=false, fuzzyPass=false |
| moonshotai/kimi-k2.5 | 2 | regular | toolPass=false, schemaPass=false, fuzzyPass=true |
| moonshotai/kimi-k2.5 | 3 | regular | toolPass=false, schemaPass=false, fuzzyPass=false |
| moonshotai/kimi-k2.5 | 4 | regular | toolPass=false, schemaPass=false, fuzzyPass=true |
| moonshotai/kimi-k2.5 | 5 | regular | toolPass=false, schemaPass=false, fuzzyPass=false |
| openai/gpt-5.4 | 3 | regular | toolPass=false, schemaPass=false, fuzzyPass=false |
| openai/gpt-5.4 | 4 | regular | toolPass=false, schemaPass=false, fuzzyPass=true |
| openai/gpt-5.4 | 5 | regular | toolPass=false, schemaPass=false, fuzzyPass=false |
| openai/gpt-5.4 | 6 | regular | toolPass=false, schemaPass=false, fuzzyPass=true |
| z-ai/glm-5.1 | 3 | regular | toolPass=false, schemaPass=false, fuzzyPass=true |
| z-ai/glm-5.1 | 4 | regular | toolPass=false, schemaPass=false, fuzzyPass=true |
| z-ai/glm-5.1 | 5 | regular | toolPass=false, schemaPass=false, fuzzyPass=false |
