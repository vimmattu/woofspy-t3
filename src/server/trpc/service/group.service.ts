import { randomBytes } from "crypto";
import { sendGroupInvitationEmail } from "../../../utils/email";
import { prisma } from "../../db/client";
import { CreateGroupInput } from "../schema/group.schema";

export const getGroupsForUser = async (userId: string) => {
  return prisma.group.findMany({
    include: {
      users: {
        select: {
          admin: true,
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

  input.emails.forEach(async (email) => {
    const token = randomBytes(32).toString("hex");
    await prisma.invitationToGroup.create({
      data: {
        email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        group: {
          connect: {
            id: grp.id,
          },
        },
      },
    });
    sendGroupInvitationEmail({
      to: email,
      token,
      groupName: input.name,
    });
  });

  return grp;
};
