import { z } from "zod";
import { infiniteQueryInput } from "./common.schema";

export const sessionMiddlewareInput = z.object({
  sessionId: z.string(),
});

export const getSessionsInput = z
  .object({
    isActive: z.boolean().optional(),
    hasEnded: z.boolean().optional(),
  })
  .merge(infiniteQueryInput);

export const getSessionInput = z.object({
  id: z.string(),
});

export const createSessionInput = z.object({
  groupId: z.string().optional(),
});

export type SessionMiddlewareInput = z.infer<typeof sessionMiddlewareInput>;
export type GetSessionsInput = z.infer<typeof getSessionsInput>;
export type GetSessionInput = z.infer<typeof getSessionInput>;
export type CreateSessionInput = z.infer<typeof createSessionInput>;
