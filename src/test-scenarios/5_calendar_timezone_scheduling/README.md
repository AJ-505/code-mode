# Scenario 5 (Calendar Timezone Scheduling)

Status: wired and runnable (deterministic simulation).

Run commands:

- `bun run benchmark:scenario5:regular`
- `bun run benchmark:scenario5:code-mode`

What it simulates:

- local + Bolivia timezone scheduling with working-hour constraints
- conflict-aware slot proposal from deterministic scheduling context
- strict JSON output + benchmark observability logs in `results/`
