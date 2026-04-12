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

function extractReasoningFromItem(item: unknown): string[] {
  if (typeof item !== "object" || item === null) return [];

  const chunks: string[] = [];

  if (
    "summary" in item &&
    Array.isArray((item as { summary?: unknown }).summary)
  ) {
    for (const part of (item as { summary: unknown[] }).summary) {
      if (typeof part === "string") {
        chunks.push(part);
      } else if (
        typeof part === "object" &&
        part !== null &&
        "text" in part &&
        typeof (part as { text?: unknown }).text === "string"
      ) {
        chunks.push((part as { text: string }).text);
      }
    }
  }

  if ("content" in item) {
    chunks.push(...extractTextFromContent((item as { content?: unknown }).content));
  }

  if (
    "reasoning" in item &&
    typeof (item as { reasoning?: unknown }).reasoning === "string"
  ) {
    chunks.push((item as { reasoning: string }).reasoning);
  }

  return chunks;
}

export function extractResponseText(response: { output?: unknown }): string {
  const output = response.output;
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

export function extractResponseReasoning(response: { output?: unknown }): string {
  const output = response.output;
  if (!Array.isArray(output)) return "";

  const chunks: string[] = [];

  for (const item of output) {
    if (typeof item !== "object" || item === null) continue;

    const type =
      "type" in item && typeof (item as { type?: unknown }).type === "string"
        ? (item as { type: string }).type
        : "";

    if (type.includes("reasoning") || type.includes("thinking")) {
      chunks.push(...extractReasoningFromItem(item));
    }
  }

  return chunks.join("\n").trim();
}
