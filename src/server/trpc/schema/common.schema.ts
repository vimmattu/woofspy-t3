import { z } from "zod";

export const infiniteQueryInput = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
});

export type InfiniteQueryInput = z.infer<typeof infiniteQueryInput>;
