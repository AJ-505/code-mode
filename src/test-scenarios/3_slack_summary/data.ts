import type { Scenario3Result } from "./types.js";

export const SCENARIO3_CHANNEL_ID = "C123BENCH";

export function getScenario3ExpectedResult(): Scenario3Result {
  const to = new Date();
  const from = new Date(to.getTime() - 24 * 60 * 60 * 1000);

  return {
    channelId: SCENARIO3_CHANNEL_ID,
    fromIso: from.toISOString(),
    toIso: to.toISOString(),
    summary:
      "Team discussed release scope, identified one blocker on analytics instrumentation, and aligned on ownership for fixes.",
    topics: [
      "Release planning",
      "Analytics blocker",
      "Customer onboarding bug triage",
    ],
    actionItems: [
      {
        owner: "Avery",
        task: "Fix analytics event naming mismatch before release cutoff.",
      },
      {
        owner: "Jordan",
        task: "Prepare rollout checklist and post channel update by EOD.",
      },
    ],
  };
}
