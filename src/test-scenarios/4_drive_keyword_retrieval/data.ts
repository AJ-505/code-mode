import type { Scenario4Result } from "./types.js";

export const SCENARIO4_DEFAULT_QUERY = "rollback";
export const SCENARIO4_DEFAULT_SPEAKER = "Avery";
export const SCENARIO4_DEFAULT_DATE = "2026-04-10";

export function getScenario4ExpectedResult(): Scenario4Result {
  return {
    query: SCENARIO4_DEFAULT_QUERY,
    speaker: SCENARIO4_DEFAULT_SPEAKER,
    date: SCENARIO4_DEFAULT_DATE,
    matches: [
      {
        fileId: "drive-file-001",
        fileName: "Team Sync - 2026-04-10",
        excerpt:
          "Avery: If metrics degrade after deploy, we will rollback within 30 minutes.",
      },
      {
        fileId: "drive-file-002",
        fileName: "Incident Review Notes",
        excerpt:
          "Avery: Document the rollback trigger and notify support before executing.",
      },
    ],
  };
}
