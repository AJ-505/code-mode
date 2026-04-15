# Scenario 2 (Playwright UI Audit)

Status: wired and runnable.

Run commands:

- `bun run benchmark:scenario2:regular`
- `bun run benchmark:scenario2:code-mode`

The current implementation uses deterministic baseline findings to validate harness behavior,
plus full observability logs in `results/` and paired regular/code-mode comparison output.

Audit target URL baseline: `https://playwright.dev`
