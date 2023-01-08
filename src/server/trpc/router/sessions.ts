import { t, authedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import AWS from "aws-sdk";
import { env } from "../../../env/server.mjs";

const s3 = new AWS.S3({
  region: "eu-north-1",
  endpoint: env.AWS_S3_ENDPOINT,
  s3ForcePathStyle: !!env.AWS_S3_ENDPOINT,
  credentials: {
    accessKeyId: env.AWS_S3_ACCESS_KEY,
    secretAccessKey: env.AWS_S3_SECRET_KEY,
  },
});

const sessionOwnerProcedure = authedProcedure
  .input(z.object({ sessionId: z.string() }))
  .use(async ({ ctx, next, input }) => {
    const session = await ctx.prisma.spySession.findFirst({
      where: { id: input.sessionId },
    });

    if (session?.userId !== ctx.session.user.id)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Session does not belong to the requesting user.",
      });

    return next({
      ctx: {
        ...ctx,
        spySession: session,
      },
    });
  });

const recordingOwnerProcedure = authedProcedure
  .input(z.object({ recordingId: z.string() }))
  .use(async ({ ctx, next, input }) => {
    const recording = await ctx.prisma.recording.findFirst({
      where: { id: input.recordingId },
    });

    if (!recording) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Could not find recording with given id.",
      });
    }

    const session = await ctx.prisma.spySession.findFirst({
      where: { id: recording.sessionId },
    });

    if (session?.userId !== ctx.session.user.id)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Recording does not belong to the requesting user.",
      });

    return next({
      ctx: {
        ...ctx,
        recording,
        spySession: session,
      },
    });
  });

export const sessionsRouter = t.router({
  getSessions: authedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        excludeActive: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const sessions = await ctx.prisma.spySession.findMany({
        select: {
          id: true,
          startTime: true,
          endTime: true,
          _count: {
            select: {
              recordings: true,
            },
          },
        },
        where: {
          userId: ctx.session.user.id,
          startTime: { gte: dayjs().subtract(1, "month").toDate() },
          endTime: input.excludeActive ? { not: null } : undefined,
        },
        orderBy: { startTime: "desc" },
        take: input.limit,
      });
      return sessions;
    }),
  getInfiniteSessions: authedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const sessions = await ctx.prisma.spySession.findMany({
        select: {
          id: true,
          startTime: true,
          endTime: true,
          _count: {
            select: {
              recordings: true,
            },
          },
        },
        where: {
          userId: ctx.session.user.id,
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { startTime: "desc" },
      });
      let nextCursor: typeof cursor | undefined;
      if (sessions.length > limit) {
        const nextItem = sessions.pop();
        nextCursor = nextItem?.id;
      }
      return {
        sessions,
        nextCursor,
      };
    }),
  getSession: authedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.spySession.findFirst({
        select: {
          id: true,
          startTime: true,
          endTime: true,
          _count: {
            select: {
              recordings: true,
            },
          },
        },
        where: { userId: ctx.session.user.id, id: input.id },
      });
    }),
  getActiveSession: authedProcedure.query(({ ctx }) => {
    return ctx.prisma.spySession.findFirst({
      where: { endTime: null },
    });
  }),
  closeActiveSessions: authedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.spySession.updateMany({
      where: { endTime: null },
      data: { endTime: new Date() },
    });
  }),
  createSession: authedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.spySession.updateMany({
      where: { endTime: null, userId: ctx.session.user.id },
      data: { endTime: new Date() },
    });

    return ctx.prisma.spySession.create({
      data: {
        userId: ctx.session.user.id,
      },
    });
  }),
  endSession: sessionOwnerProcedure.mutation(async ({ ctx }) => {
    const session = ctx.spySession;

    if (!!session.endTime)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Can't end already ended session.",
      });

    return ctx.prisma.spySession.update({
      where: { id: session.id },
      data: { endTime: new Date() },
    });
  }),
  getRecordings: sessionOwnerProcedure.query(async ({ ctx }) => {
    return ctx.prisma.recording.findMany({
      where: { sessionId: ctx.spySession.id },
      orderBy: { startTime: "desc" },
    });
  }),
  getInfiniteRecordings: sessionOwnerProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const recordings = await ctx.prisma.recording.findMany({
        where: { sessionId: input.sessionId },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { startTime: "desc" },
      });

      let nextCursor: typeof cursor | undefined;
      if (recordings.length > limit) {
        const nextItem = recordings.pop();
        nextCursor = nextItem?.id;
      }
      return {
        recordings,
        nextCursor,
      };
    }),
  createRecording: sessionOwnerProcedure.mutation(async ({ ctx }) => {
    if (!!ctx.spySession.endTime)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Can't create recording for an ended session.",
      });

    const recording = await ctx.prisma.recording.create({
      data: { sessionId: ctx.spySession.id },
    });

    return s3.createPresignedPost({
      Fields: {
        key: `recording/${ctx.session.user.id}/${recording.id}`,
      },
      Conditions: [
        ["content-length-range", 0, 10000000],
        //["starts-with", "$Content-Type", "video/"], //TODO: Add content-type requirement
      ],
      Expires: 30,
      Bucket: env.AWS_S3_BUCKET_NAME,
    });
  }),
  getRecordingSignedUrl: recordingOwnerProcedure.query(async ({ ctx }) => {
    return s3.getSignedUrlPromise("getObject", {
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: `recording/${ctx.session.user.id}/${ctx.recording.id}`,
    });
  }),
});
