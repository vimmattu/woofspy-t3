import { t, authedProcedure } from "../trpc";
import { z } from "zod";
import { sendGroupInvitationEmail } from "../../../utils/email";
import { randomBytes } from "crypto";

export const groupsRouter = t.router({
  getGroups: authedProcedure.query(({ ctx }) => {
    return ctx.prisma.group.findMany({
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
            userId: ctx.session.user.id,
          },
        },
      },
    });
  }),
  createGroup: authedProcedure
    .input(
      z.object({
        name: z.string(),
        emails: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const grp = await ctx.prisma.group.create({
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
                    email: ctx.session.user.email!,
                  },
                },
              },
            ],
          },
        },
      });

      input.emails.forEach(async (email) => {
        const token = randomBytes(32).toString("hex");
        await ctx.prisma.invitationToGroup.create({
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
    }),
});
