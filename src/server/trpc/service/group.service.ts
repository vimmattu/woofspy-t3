import { randomBytes } from "crypto";
import { sendGroupInvitationEmail } from "../../../utils/email";
import { prisma } from "../../db/client";
import { CreateGroupInput } from "../schema/group.schema";

const baseQueryProps = (userId: string) => ({
  include: {
    users: {
      select: {
        userId: true,
        admin: true,
        selectByDefault: true,
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    },
  },
  where: {
    users: {
      some: {
        userId,
      },
    },
  },
});

export const getGroupsForUser = async (userId: string) => {
  return prisma.group.findMany({
    ...baseQueryProps(userId),
  });
};

export const getGroupForUser = async (userId: string, groupId: string) => {
  const query = baseQueryProps(userId);
  return prisma.group.findFirst({
    ...query,
    where: {
      ...query.where,
      id: groupId,
    },
  });
};

const inviteUsersToGroup = async (
  emails: string[],
  groupId: string,
  groupName: string
) => {
  emails.forEach(async (email) => {
    const token = randomBytes(32).toString("hex");
    await prisma.invitationToGroup.create({
      data: {
        email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        group: {
          connect: {
            id: groupId,
          },
        },
      },
    });
    sendGroupInvitationEmail({
      to: email,
      token,
      groupName: groupName,
    });
  });
};

export const createGroup = async (
  creatorId: string,
  input: CreateGroupInput
) => {
  const grp = await prisma.group.create({
    select: {
      id: true,
      name: true,
      users: true,
    },
    data: {
      name: input.name,
      users: {
        create: [
          {
            admin: true,
            selectByDefault: input.selectedByDefault,
            user: {
              connect: {
                id: creatorId,
              },
            },
          },
        ],
      },
    },
  });

  inviteUsersToGroup(input.emails, grp.id, grp.name);

  return grp;
};

export const updateGroup = async (
  userId: string,
  group: NonNullable<Awaited<ReturnType<typeof getGroupForUser>>>,
  input: CreateGroupInput
) => {
  const existingGroupUsers = group?.users
    .map(({ user }) => user.email)
    .filter(Boolean);
  const deletedUsers = existingGroupUsers?.filter(
    (email) => !input.emails.includes(email!)
  );
  const newUsers = input.emails.filter(
    (email) => !existingGroupUsers?.includes(email)
  );

  const deletedIds = group.users
    .filter((user) => deletedUsers?.includes(user.user.email))
    .map(({ userId }) => userId);

  await Promise.all([
    prisma.group.update({
      where: {
        id: group.id,
      },
      data: {
        name: input.name,
      },
    }),
    prisma.usersInGroups.update({
      where: {
        userId_groupId: {
          userId,
          groupId: group.id,
        },
      },
      data: {
        selectByDefault: input.selectedByDefault,
      },
    }),
    prisma.usersInGroups.deleteMany({
      where: {
        userId: {
          in: deletedIds,
        },
        groupId: group.id,
      },
    }),
  ]);

  inviteUsersToGroup(newUsers, group.id, input.name);
};
