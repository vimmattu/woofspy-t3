import { t, authedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { prisma } from "../../db/client";

async function assertSessionBelongsToUser(userId: string, sessionId: string) {
  const session = await prisma.spySession.findFirst({
    where: { id: sessionId },
  });
  if (session?.userId !== userId)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Session does not belong to the requesting user.",
    });

  // TODO: change so returning session here would be more intuitive
  return session;
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
  endSession: authedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await assertSessionBelongsToUser(ctx.session.user.id, input.id);

      return ctx.prisma.spySession.update({
        where: { id: input.id },
        data: { endTime: new Date() },
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
      const session = await assertSessionBelongsToUser(
        ctx.session.user.id,
        input.sessionId
      );

      if (!!session.endTime)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Can't create recording for an ended session.",
        });

      return ctx.prisma.recording.create({
        data: { sessionId: input.sessionId },
      });
    }),
});
