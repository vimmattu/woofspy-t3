import { t, authedProcedure } from "../trpc";
import { createGroupInput } from "../schema/group.schema";
import { createGroup, getGroupsForUser } from "../service/group.service";

export const groupsRouter = t.router({
  getGroups: authedProcedure.query(({ ctx }) =>
    getGroupsForUser(ctx.session.user.id)
  ),
  createGroup: authedProcedure
    .input(createGroupInput)
    .mutation(({ ctx, input }) => createGroup(ctx.session.user.id, input)),
});
