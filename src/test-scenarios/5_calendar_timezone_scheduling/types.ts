import { z } from "zod";

export const scenario5ResultSchema = z.object({
  proposedStartIso: z.iso.datetime(),
  proposedEndIso: z.iso.datetime(),
  localTimezone: z.string().min(1),
  boliviaTimezone: z.string().min(1),
  rationale: z.string().min(1),
});

export type Scenario5Result = z.infer<typeof scenario5ResultSchema>;
