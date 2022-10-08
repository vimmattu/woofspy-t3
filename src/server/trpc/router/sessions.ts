import { t, authedProcedure } from "../trpc";
import { z } from "zod";

export const sessionsRouter = t.router({
  getSessions: t.procedure.query(({ ctx }) => {
    return ctx.prisma.spySession.findMany();
  }),
  getRecordings: t.procedure
    .input(z.object({ sessionId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.recording.findMany({
        where: { sessionId: input.sessionId },
      });
    }),
});
