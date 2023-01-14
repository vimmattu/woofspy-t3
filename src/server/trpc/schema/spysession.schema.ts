import { z } from "zod";

export const getSessionsInput = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
});

export const getSessionInput = z.object({
  id: z.string(),
});

export type GetSessionsInput = z.infer<typeof getSessionsInput>;
export type GetSessionInput = z.infer<typeof getSessionInput>;
