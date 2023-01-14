// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { authRouter } from "./auth";
import { groupsRouter } from "./groups";
import { spySessionsRouter } from "./spysession.route";
import { recordingsRouter } from "./recording.route";

export const appRouter = t.router({
  auth: authRouter,
  spySessions: spySessionsRouter,
  recordings: recordingsRouter,
  groups: groupsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
