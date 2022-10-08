// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { sessionsRouter } from "./sessions";

export const appRouter = t.router({
  example: exampleRouter,
  auth: authRouter,
  sessions: sessionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
