import * as Bun from "bun";
import { mkdir } from "node:fs/promises";

const resultsDir = "./results";

function sanitizeLabel(value: string) {
  return value.replaceAll(/[^a-zA-Z0-9_.-]/g, "_");
}

async function getUniqueFilePath(modelDir: string, baseFileName: string): Promise<string> {
  let filePath = `${modelDir}/${baseFileName}.json`;
  let counter = 1;
  while (await Bun.file(filePath).exists()) {
    filePath = `${modelDir}/${baseFileName}-${counter}.json`;
    counter++;
  }
  return filePath;
}

async function main() {
  const glob = new Bun.Glob("*.json");
  const files: string[] = [];

  for await (const file of glob.scan(resultsDir)) {
    if (!file.startsWith(".")) {
      files.push(file);
    }
  }

  console.log(`Found ${files.length} JSON files to reorganize`);

  for (const file of files) {
    const oldPath = `${resultsDir}/${file}`;
    try {
      const data = await Bun.file(oldPath).json();
      const modelLabel = sanitizeLabel(data.model || "unknown");
      const modelDir = `${resultsDir}/${modelLabel}`;

      await mkdir(modelDir, { recursive: true });

      let baseFileName: string;
      if (data.winner !== undefined) {
        baseFileName = `scenario-${data.scenarioNumber}-final-${sanitizeLabel(data.pairId)}`;
      } else {
        baseFileName = `scenario-${data.scenarioNumber}-${data.mode}-${sanitizeLabel(data.pairId)}`;
      }

      const newPath = await getUniqueFilePath(modelDir, baseFileName);

      await Bun.write(newPath, await Bun.file(oldPath).text());
      await Bun.file(oldPath).delete();

      console.log(`✓ ${file} → ${newPath.replace(resultsDir + "/", "")}`);
    } catch (e) {
      console.error(`✗ Failed to process ${file}: ${e}`);
    }
  }

  console.log("\nReorganization complete!");
}

main();
