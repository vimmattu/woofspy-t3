import { TRPCError } from "@trpc/server";
import { recordingMiddlewareInput } from "../schema/recording.schema";
import { getRecordingById } from "../service/recording.service";
import { authedProcedure } from "../trpc";
import { getSessionIfUserHasAccess } from "./spysession.middleware";

export const recordingAccessProcedure = authedProcedure
  .input(recordingMiddlewareInput)
  .use(async ({ ctx, next, input }) => {
    const recording = await getRecordingById(input.recordingId);

    if (!recording) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Could not find recording with given id.",
      });
    }

    const session = await getSessionIfUserHasAccess(
      ctx.session.user.id,
      recording.sessionId
    );

    return next({
      ctx: {
        ...ctx,
        recording,
        spySession: session,
      },
    });
  });
