# Latest run health report

Generated from the latest JSON run artifact per `model + scenario + mode`.

- Total latest runs: **68**
- Properly completed: **42**
- Improper/incomplete: **26**

## Improper/incomplete latest runs (rerun targets)

| Model | Scenario | Mode | Why it did not run properly | Rerun command |
|---|---:|---|---|---|
| anthropic/claude-sonnet-4.6 | 1 | regular | DB connectivity | `MODEL="anthropic/claude-sonnet-4.6" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario1:regular` |
| anthropic/opus-4.6 | 1 | regular | Invalid model ID | `MODEL="anthropic/opus-4.6" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario1:regular` |
| anthropic/opus-4.99 | 1 | code-mode | DB connectivity | `MODEL="anthropic/opus-4.99" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario1:code-mode` |
| anthropic/opus-4.99 | 1 | regular | Invalid model ID | `MODEL="anthropic/opus-4.99" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario1:regular` |
| anthropic/opus-4.99 | 2 | regular | Invalid model ID | `MODEL="anthropic/opus-4.99" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario2:regular` |
| google/gemini-3.1-pro-preview | 2 | regular | Provider/server error | `MODEL="google/gemini-3.1-pro-preview" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario2:regular` |
| google/gemma-4-26b-a4b-it:free | 1 | code-mode | Provider error | `MODEL="google/gemma-4-26b-a4b-it:free" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario1:code-mode` |
| minimax/minimax-m2.7 | 2 | regular | Provider/server error | `MODEL="minimax/minimax-m2.7" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario2:regular` |
| minimax/minimax-m2.7 | 3 | regular | Provider/server error | `MODEL="minimax/minimax-m2.7" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario3:regular` |
| minimax/minimax-m2.7 | 6 | regular | Provider/server error | `MODEL="minimax/minimax-m2.7" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario6:regular` |
| moonshotai/kimi-k2.5 | 1 | code-mode | DB connectivity | `MODEL="moonshotai/kimi-k2.5" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario1:code-mode` |
| moonshotai/kimi-k2.5 | 1 | regular | DB connectivity | `MODEL="moonshotai/kimi-k2.5" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario1:regular` |
| moonshotai/kimi-k2.5 | 2 | code-mode | OpenRouter connectivity | `MODEL="moonshotai/kimi-k2.5" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario2:code-mode` |
| moonshotai/kimi-k2.5 | 2 | regular | OpenRouter connectivity | `MODEL="moonshotai/kimi-k2.5" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario2:regular` |
| moonshotai/kimi-k2.5 | 3 | code-mode | OpenRouter connectivity | `MODEL="moonshotai/kimi-k2.5" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario3:code-mode` |
| moonshotai/kimi-k2.5 | 3 | regular | OpenRouter connectivity | `MODEL="moonshotai/kimi-k2.5" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario3:regular` |
| moonshotai/kimi-k2.5 | 4 | regular | OpenRouter connectivity | `MODEL="moonshotai/kimi-k2.5" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario4:regular` |
| moonshotai/kimi-k2.6 | 1 | code-mode | DB connectivity | `MODEL="moonshotai/kimi-k2.6" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario1:code-mode` |
| moonshotai/kimi-k2.6 | 1 | regular | DB connectivity | `MODEL="moonshotai/kimi-k2.6" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario1:regular` |
| openai/gpt-5.4 | 1 | code-mode | DB connectivity | `MODEL="openai/gpt-5.4" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario1:code-mode` |
| openai/gpt-5.4 | 1 | regular | DB connectivity | `MODEL="openai/gpt-5.4" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario1:regular` |
| openai/gpt-5.4 | 2 | regular | Provider error | `MODEL="openai/gpt-5.4" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario2:regular` |
| openai/gpt-5.4 | 3 | regular | Provider error | `MODEL="openai/gpt-5.4" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario3:regular` |
| openrouter/free | 1 | code-mode | Rate limit | `MODEL="openrouter/free" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario1:code-mode` |
| openrouter/free | 1 | regular | Timeout | `MODEL="openrouter/free" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario1:regular` |
| z-ai/glm-5.1 | 6 | code-mode | Timeout | `MODEL="z-ai/glm-5.1" INPUT_COST_PER_MILLION_USD=0.3827 OUTPUT_COST_PER_MILLION_USD=1.72 bun run benchmark:scenario6:code-mode` |

## Moonshot (`moonshotai/kimi-k2.5`) missing coverage

No latest run artifacts existed for:

- scenario 4 code-mode
- scenario 5 regular
- scenario 5 code-mode
- scenario 6 regular
- scenario 6 code-mode
