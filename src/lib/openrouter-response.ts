function extractTextFromContent(content: unknown): string[] {
  if (!Array.isArray(content)) return [];

  const chunks: string[] = [];

  for (const block of content) {
    if (typeof block !== "object" || block === null) continue;

    if (
      "text" in block &&
      typeof (block as { text?: unknown }).text === "string"
    ) {
      chunks.push((block as { text: string }).text);
      continue;
    }

    if (
      "content" in block &&
      typeof (block as { content?: unknown }).content === "string"
    ) {
      chunks.push((block as { content: string }).content);
    }
  }

  return chunks;
}

export function extractResponseText(response: { output?: unknown }): string {
  const output = (response as { output?: unknown }).output;
  if (!Array.isArray(output)) return "";

  const chunks: string[] = [];

  for (const item of output) {
    if (typeof item !== "object" || item === null) continue;

    if ("content" in item) {
      chunks.push(...extractTextFromContent((item as { content?: unknown }).content));
    }

    if (
      "text" in item &&
      typeof (item as { text?: unknown }).text === "string"
    ) {
      chunks.push((item as { text: string }).text);
    }
  }

  return chunks.join("\n").trim();
}
