import type { Scenario6Result } from "./types.js";

export const SCENARIO6_REPO = "octo-org/benchmark-demo-repo";
export const SCENARIO6_DEFAULT_BRANCH = "benchmark/fix-readme-typo";
export const SCENARIO6_REQUESTED_CHANGE =
  "Fix a typo in README setup steps and clarify the benchmark command.";

export function getScenario6ExpectedResult(): Scenario6Result {
  return {
    repo: SCENARIO6_REPO,
    branch: SCENARIO6_DEFAULT_BRANCH,
    changedFiles: [
      {
        path: "README.md",
        changeSummary:
          "Corrected setup typo and clarified benchmark run command formatting.",
      },
    ],
    prTitle: "docs: fix README setup typo and benchmark command wording",
    prBody:
      "## Summary\n- fix typo in README setup instructions\n- clarify benchmark execution command\n\n## Validation\n- docs-only simulation benchmark output",
    prUrl: `https://github.com/${SCENARIO6_REPO}/pull/128`,
  };
}

export function getScenario6RepoContext() {
  return {
    repo: SCENARIO6_REPO,
    defaultBranch: "main",
    requestedChange: SCENARIO6_REQUESTED_CHANGE,
  };
}
