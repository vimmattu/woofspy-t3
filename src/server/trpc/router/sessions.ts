import { t, authedProcedure } from "../trpc";
// import { z } from "zod";

export const sessionsRouter = t.router({
  getAll: authedProcedure.query(({ ctx }) => ctx.prisma.spySession.findMany()),
});
