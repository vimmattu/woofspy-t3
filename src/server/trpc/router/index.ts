// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { authRouter } from "./auth";
import { sessionsRouter } from "./sessions";

export const appRouter = t.router({
  auth: authRouter,
  sessions: sessionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
