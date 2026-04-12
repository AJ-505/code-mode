# Scenario 3 (Slack 24h Summary)

Status: wired and runnable.

Run commands:

- `bun run benchmark:scenario3:regular`
- `bun run benchmark:scenario3:code-mode`

The current implementation uses deterministic baseline Slack summary data to validate harness behavior,
plus full observability logs in `results/` and paired regular/code-mode comparison output.
