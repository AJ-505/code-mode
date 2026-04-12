import { z } from "zod";

export const scenario4MatchSchema = z.object({
  fileId: z.string().min(1),
  fileName: z.string().min(1),
  excerpt: z.string().min(1),
});

export const scenario4ResultSchema = z.object({
  query: z.string().min(1),
  speaker: z.string().min(1),
  date: z.string().min(1),
  matches: z.array(scenario4MatchSchema),
});

export type Scenario4Result = z.infer<typeof scenario4ResultSchema>;
