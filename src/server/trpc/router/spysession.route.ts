import { t, authedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  createSessionInput,
  getSessionInput,
  getSessionsInput,
} from "../schema/spysession.schema";
import {
  createSession,
  endSession,
  getManySessionsForUser,
  getSessionForUser,
} from "../service/spysession.service";
import { sessionAccessProcedure } from "../middleware/spysession.middleware";

export const spySessionsRouter = t.router({
  getSessions: authedProcedure
    .input(getSessionsInput)
    .query(({ ctx, input }) =>
      getManySessionsForUser(ctx.session.user.id, input)
    ),
  getSession: authedProcedure
    .input(getSessionInput)
    .query(({ ctx, input }) =>
      getSessionForUser(ctx.session.user.id, input.id)
    ),
  createSession: authedProcedure
    .input(createSessionInput)
    .mutation(({ ctx, input }) =>
      createSession(ctx.session.user.id, input.groupId)
    ),
  endSession: sessionAccessProcedure.mutation(({ ctx }) => {
    if (!!ctx.spySession.endTime)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Can't end already ended session.",
      });
    return endSession(ctx.spySession.id);
  }),
});
