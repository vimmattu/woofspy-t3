import { prisma } from "../../db/client";
import { GetSessionsInput } from "../schema/spysession.schema";
import { infiniteQuery } from "./common.service";

const getUserGroupIds = async (userId: string) => {
  const groups = await prisma.group.findMany({
    where: {
      users: {
        some: {
          userId,
        },
      },
    },
    select: {
      id: true,
    },
  });
  return groups.map((g) => g.id);
};

const baseGetQuery = (userId: string, groupIds: string[]) => ({
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
    OR: [
      {
        userId,
      },
      {
        groupId: {
          in: groupIds,
        },
      },
    ],
  },
});

export const getManySessionsForUser = async (
  userId: string,
  input: GetSessionsInput
) => {
  const groups = await getUserGroupIds(userId);
  const baseQuery = baseGetQuery(userId, groups);
  const [infQuery, getNextCursor] = infiniteQuery("id", input);
  const sessions = await prisma.spySession.findMany({
    ...baseQuery,
    ...infQuery,
    where: {
      ...baseQuery.where,
      endTime: input.isActive
        ? null
        : input.hasEnded
        ? { not: null }
        : undefined,
    },
    orderBy: { startTime: "desc" },
  });
  const nextCursor = getNextCursor(sessions);
  return {
    sessions,
    nextCursor,
  };
};

export const getSessionForUser = async (userId: string, sessionId: string) => {
  const groups = await getUserGroupIds(userId);
  const baseQuery = baseGetQuery(userId, groups);
  return prisma.spySession.findFirst({
    ...baseQuery,
    select: {
      ...baseQuery.select,
      userId: true,
    },
    where: {
      ...baseQuery.where,
      id: sessionId,
    },
  });
};

export const createSession = async (userId: string, groupId?: string) => {
  // End all sessions for user
  await prisma.spySession.updateMany({
    where: { endTime: null, userId },
    data: { endTime: new Date() },
  });

  return prisma.spySession.create({
    data: {
      userId,
      groupId,
    },
  });
};

export const endSession = async (id: string) => {
  return prisma.spySession.update({
    where: { id },
    data: { endTime: new Date() },
  });
};
