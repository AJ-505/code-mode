import * as Bun from "bun";
import { runCodeModeBenchmark } from "./test-scenarios/1_customer_db_average_spend/code-mode.js";
import { runRegularBenchmark } from "./test-scenarios/1_customer_db_average_spend/regular.js";
import { runScenario2CodeMode } from "./test-scenarios/2_playwright_ui_audit/code-mode.js";
import { runScenario2Regular } from "./test-scenarios/2_playwright_ui_audit/regular.js";
import { runScenario3CodeMode } from "./test-scenarios/3_slack_summary/code-mode.js";
import { runScenario3Regular } from "./test-scenarios/3_slack_summary/regular.js";

function parseArgs() {
  const args = Bun.argv.slice(2);
  const modeFlag = args.find((arg) => arg.startsWith("--mode="));
  const scenarioFlag = args.find((arg) => arg.startsWith("--scenario="));

  const mode = modeFlag?.split("=")[1] ?? "regular";
  const scenario = scenarioFlag?.split("=")[1] ?? "1";

  return { mode, scenario };
}

if (import.meta.main) {
  const { mode, scenario } = parseArgs();

  if (mode !== "code-mode" && mode !== "regular") {
    throw new Error(`Unsupported mode '${mode}'. Use --mode=regular or --mode=code-mode.`);
  }

  if (scenario === "1") {
    if (mode === "code-mode") {
      await runCodeModeBenchmark();
    } else {
      await runRegularBenchmark();
    }
    process.exit(0);
  }

  if (scenario === "2") {
    if (mode === "code-mode") {
      await runScenario2CodeMode();
    } else {
      await runScenario2Regular();
    }
    process.exit(0);
  }

  if (scenario === "3") {
    if (mode === "code-mode") {
      await runScenario3CodeMode();
    } else {
      await runScenario3Regular();
    }
    process.exit(0);
  }

  throw new Error(`Unsupported scenario '${scenario}'. Wired scenarios: 1, 2, 3.`);
}
