import type { Scenario2Result } from "./types.js";

export const SCENARIO2_SITE_URL = "https://example.com";

export function getScenario2ExpectedResult(): Scenario2Result {
  return {
    siteUrl: SCENARIO2_SITE_URL,
    findings: [
      {
        severity: "medium",
        title: "Low visual hierarchy on hero section",
        description:
          "Primary heading and supporting text have similar weight and contrast, reducing scannability.",
        location: "/ hero",
        suggestedFix:
          "Increase heading size/weight and reduce secondary text prominence for clearer hierarchy.",
      },
      {
        severity: "low",
        title: "No explicit keyboard focus styling",
        description:
          "Interactive elements rely on default browser focus outline with inconsistent visibility.",
        location: "Global interactive elements",
        suggestedFix:
          "Define a consistent, high-contrast focus ring across interactive components.",
      },
    ],
    summary:
      "Site is usable but needs stronger information hierarchy and accessibility-focused interaction states.",
  };
}
