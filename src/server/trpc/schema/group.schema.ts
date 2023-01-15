import { z } from "zod";

export const getGroupInput = z.object({
  id: z.string(),
});

export const createGroupInput = z.object({
  name: z.string(),
  emails: z.array(z.string()),
  selectedByDefault: z.boolean(),
});

export type GetGroupInput = z.infer<typeof getGroupInput>;
export type CreateGroupInput = z.infer<typeof createGroupInput>;
