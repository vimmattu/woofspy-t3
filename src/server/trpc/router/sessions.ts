import { t, authedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { prisma } from "../../db/client";
import dayjs from "dayjs";
import AWS from "aws-sdk";
import { env } from "../../../env/server.mjs";

const s3 = new AWS.S3({
  region: "eu-north-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_KEY,
  },
});

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
  getSessions: authedProcedure.query(async ({ ctx }) => {
    // TODO: Refactor
    const sessions = await ctx.prisma.spySession.findMany({
      where: {
        userId: ctx.session.user.id,
        startTime: { gte: dayjs().subtract(1, "month").toDate() },
      },
      orderBy: { startTime: "desc" },
      include: {
        recordings: true,
      },
    });
    return sessions.reduce((prev: Record<string, typeof sessions>, curr) => {
      const formattedDate = dayjs(curr.startTime).format("YYYY-MM-DD");
      if (!prev[formattedDate]) prev[formattedDate] = [];
      prev[formattedDate]?.push(curr);
      return prev;
    }, {});
  }),
  getSession: authedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.spySession.findFirst({
        where: { userId: ctx.session.user.id, id: input.id },
      });
    }),
  getActiveSession: authedProcedure.query(({ ctx }) => {
    return ctx.prisma.spySession.findFirst({
      where: { endTime: null },
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
      const session = await assertSessionBelongsToUser(
        ctx.session.user.id,
        input.id
      );

      if (!!session.endTime)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Can't end already ended session.",
        });

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

      const recording = await ctx.prisma.recording.create({
        data: { sessionId: input.sessionId },
      });

      return s3.createPresignedPost({
        Fields: {
          key: `${ctx.session.user.id}/${recording.id}`,
        },
        Conditions: [
          ["content-length-range", 0, 10000000],
          ["starts-with", "$Content-Type", "video/"],
        ],
        Expires: 30,
        Bucket: env.AWS_S3_BUCKET,
      });
    }),
});
