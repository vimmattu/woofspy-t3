import { z } from "zod";

export const recordingMiddlewareInput = z.object({
  recordingId: z.string(),
});

export type RecordingMiddlewareInput = z.infer<typeof recordingMiddlewareInput>;
