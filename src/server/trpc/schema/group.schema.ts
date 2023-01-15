import { z } from "zod";

export const createGroupInput = z.object({
  name: z.string(),
  emails: z.array(z.string()),
});

export type CreateGroupInput = z.infer<typeof createGroupInput>;
