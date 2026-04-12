import { z } from "zod";

export const scenario2FindingSchema = z.object({
  severity: z.enum(["low", "medium", "high", "critical"]),
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  suggestedFix: z.string().min(1),
});

export const scenario2ResultSchema = z.object({
  siteUrl: z.url(),
  findings: z.array(scenario2FindingSchema),
  summary: z.string().min(1),
});

export type Scenario2Finding = z.infer<typeof scenario2FindingSchema>;
export type Scenario2Result = z.infer<typeof scenario2ResultSchema>;
