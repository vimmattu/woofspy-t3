import { t, authedProcedure } from "../trpc";
import { z } from "zod";

export const sessionsRouter = t.router({
  getSessions: t.procedure.query(({ ctx }) => {
    return ctx.prisma.spySession.findMany();
  }),
  createSession: t.procedure.mutation(({ ctx }) => {
    return ctx.prisma.spySession.create({ data: {} });
  }),
  getRecordings: t.procedure
    .input(z.object({ sessionId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.recording.findMany({
        where: { sessionId: input.sessionId },
      });
    }),
  createRecording: t.procedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.recording.create({
        data: { sessionId: input.sessionId },
      });
    }),
});
