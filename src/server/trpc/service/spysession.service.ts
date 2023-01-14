import { prisma } from "../../db/client";
import { GetSessionsInput } from "../schema/spysession.schema";

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
  const limit = input.limit ?? 8;
  const { cursor } = input;
  const groups = await getUserGroupIds(userId);
  const sessions = await prisma.spySession.findMany({
    ...baseGetQuery(userId, groups),
    orderBy: { startTime: "desc" },
    take: limit,
    cursor: input.cursor ? { id: input.cursor } : undefined,
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
};

export const getSessionForUser = async (userId: string, sessionId: string) => {
  const groups = await getUserGroupIds(userId);
  const baseQuery = baseGetQuery(userId, groups);
  return prisma.spySession.findFirst({
    ...baseQuery,
    where: {
      ...baseQuery.where,
      id: sessionId,
    },
  });
};
