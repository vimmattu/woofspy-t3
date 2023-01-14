import { z } from "zod";
import { infiniteQueryInput } from "./common.schema";

export const getSessionsInput = z
  .object({
    filterActive: z.boolean().nullish(),
  })
  .merge(infiniteQueryInput);

export const getSessionInput = z.object({
  id: z.string(),
});

export const createSessionInput = z.object({
  groupId: z.string().nullish(),
});

export type GetSessionsInput = z.infer<typeof getSessionsInput>;
export type GetSessionInput = z.infer<typeof getSessionInput>;
export type CreateSessionInput = z.infer<typeof createSessionInput>;
