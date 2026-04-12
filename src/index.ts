import * as Bun from "bun";
import { runCodeModeBenchmark } from "./test-scenarios/1_customer_db_average_spend/code-mode.js";
import { runRegularBenchmark } from "./test-scenarios/1_customer_db_average_spend/regular.js";

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

  if (scenario !== "1") {
    throw new Error(`Unsupported scenario '${scenario}'. Only scenario 1 is wired.`);
  }

  if (mode === "code-mode") {
    await runCodeModeBenchmark();
  } else if (mode === "regular") {
    await runRegularBenchmark();
  } else {
    throw new Error(`Unsupported mode '${mode}'. Use --mode=regular or --mode=code-mode.`);
  }
}
