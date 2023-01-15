import { t, authedProcedure } from "../trpc";
import { createGroupInput, getGroupInput } from "../schema/group.schema";
import {
  createGroup,
  getGroupForUser,
  getGroupsForUser,
  updateGroup,
} from "../service/group.service";
import { groupAdminProcedure } from "../middleware/group.middleware";

export const groupsRouter = t.router({
  getGroups: authedProcedure.query(({ ctx }) =>
    getGroupsForUser(ctx.session.user.id)
  ),
  getGroup: authedProcedure
    .input(getGroupInput)
    .query(({ ctx, input }) => getGroupForUser(ctx.session.user.id, input.id)),
  createGroup: authedProcedure
    .input(createGroupInput)
    .mutation(({ ctx, input }) => createGroup(ctx.session.user.id, input)),
  updateGroup: groupAdminProcedure
    .input(createGroupInput)
    .mutation(({ ctx, input }) =>
      updateGroup(ctx.session.user.id, ctx.group, input)
    ),
});
