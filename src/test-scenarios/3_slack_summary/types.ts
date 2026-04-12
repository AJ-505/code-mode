import { z } from "zod";

export const scenario3ActionItemSchema = z.object({
  owner: z.string().min(1),
  task: z.string().min(1),
});

export const scenario3ResultSchema = z.object({
  channelId: z.string().min(1),
  fromIso: z.iso.datetime(),
  toIso: z.iso.datetime(),
  summary: z.string().min(1),
  topics: z.array(z.string().min(1)),
  actionItems: z.array(scenario3ActionItemSchema),
});

export type Scenario3Result = z.infer<typeof scenario3ResultSchema>;
