import { TRPCError } from "@trpc/server";
import { sessionMiddlewareInput } from "../schema/spysession.schema";
import { getSessionForUser } from "../service/spysession.service";
import { authedProcedure } from "../trpc";

export const sessionAccessProcedure = authedProcedure
  .input(sessionMiddlewareInput)
  .use(async ({ ctx, next, input }) => {
    const session = await getSessionForUser(
      ctx.session.user.id,
      input.sessionId
    );

    if (!session)
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });

    return next({
      ctx: {
        ...ctx,
        spySession: session,
      },
    });
  });
