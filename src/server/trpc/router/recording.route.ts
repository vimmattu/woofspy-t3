import { TRPCError } from "@trpc/server";
import { recordingAccessProcedure } from "../middleware/recording.middleware";
import { sessionAccessProcedure } from "../middleware/spysession.middleware";
import { infiniteQueryInput } from "../schema/common.schema";
import {
  createRecordingForSession,
  getManyRecordingsForSession,
  getRecordingSignedUrl,
} from "../service/recording.service";
import { t } from "../trpc";

export const recordingsRouter = t.router({
  getRecordings: sessionAccessProcedure
    .input(infiniteQueryInput)
    .query(({ ctx, input }) =>
      getManyRecordingsForSession(ctx.spySession.id, input)
    ),
  createRecording: sessionAccessProcedure.mutation(async ({ ctx }) => {
    if (!!ctx.spySession.endTime)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Can't create recording for an ended session.",
      });
    return createRecordingForSession(ctx.session.user.id, ctx.spySession.id);
  }),
  getRecordingFile: recordingAccessProcedure.query(({ ctx }) =>
    getRecordingSignedUrl(ctx.session.user.id, ctx.recording.id)
  ),
});
