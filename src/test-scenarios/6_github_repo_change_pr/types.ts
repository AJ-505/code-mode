import { z } from "zod";

export const scenario6ChangedFileSchema = z.object({
  path: z.string().min(1),
  changeSummary: z.string().min(1),
});

export const scenario6ResultSchema = z.object({
  repo: z.string().min(1),
  branch: z.string().min(1),
  changedFiles: z.array(scenario6ChangedFileSchema).min(1),
  prTitle: z.string().min(1),
  prBody: z.string().min(1),
  prUrl: z.url(),
});

export type Scenario6Result = z.infer<typeof scenario6ResultSchema>;
