import { t, authedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { prisma } from "../../db/client";

async function assertSessionBelongsToUser(userId: string, sessionId: string) {
  const session = await prisma.spySession.findFirst({
    where: { id: sessionId },
  });
  if (session?.userId !== userId) throw new TRPCError({ code: "UNAUTHORIZED" });
  return true;
}

export const sessionsRouter = t.router({
  getSessions: authedProcedure.query(({ ctx }) => {
    return ctx.prisma.spySession.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { startTime: "desc" },
    });
  }),
  createSession: authedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.spySession.create({
      data: {
        userId: ctx.session.user.id,
      },
    });
  }),
  getRecordings: authedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      await assertSessionBelongsToUser(ctx.session.user.id, input.sessionId);

      return ctx.prisma.recording.findMany({
        where: { sessionId: input.sessionId },
        orderBy: { startTime: "desc" },
      });
    }),
  createRecording: authedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await assertSessionBelongsToUser(ctx.session.user.id, input.sessionId);

      return ctx.prisma.recording.create({
        data: { sessionId: input.sessionId },
      });
    }),
});
