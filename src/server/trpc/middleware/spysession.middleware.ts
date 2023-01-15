import { TRPCError } from "@trpc/server";
import { sessionMiddlewareInput } from "../schema/spysession.schema";
import { getSessionForUser } from "../service/spysession.service";
import { authedProcedure } from "../trpc";

export const getSessionIfUserHasAccess = async (
  userId: string,
  sessionId: string
) => {
  const session = await getSessionForUser(userId, sessionId);

  if (!session)
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });

  return session;
};

export const sessionAccessProcedure = authedProcedure
  .input(sessionMiddlewareInput)
  .use(async ({ ctx, next, input }) => {
    const session = await getSessionIfUserHasAccess(
      ctx.session.user.id,
      input.sessionId
    );
    return next({
      ctx: {
        ...ctx,
        spySession: session,
      },
    });
  });
