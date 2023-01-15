import { TRPCError } from "@trpc/server";
import { getGroupInput } from "../schema/group.schema";
import { getGroupForUser } from "../service/group.service";
import { authedProcedure } from "../trpc";

export const groupAdminProcedure = authedProcedure
  .input(getGroupInput)
  .use(async ({ ctx, next, input }) => {
    const group = await getGroupForUser(ctx.session.user.id, input.id);

    if (!group) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Group not found",
      });
    }

    const isAdmin =
      group?.users.find((u) => u.userId === ctx.session.user.id)?.admin ||
      false;

    if (!isAdmin) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not an admin of this group",
      });
    }

    return next({
      ctx: {
        ...ctx,
        group,
      },
    });
  });
