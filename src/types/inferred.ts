import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../server/trpc/router";

export type Session = inferProcedureOutput<
  AppRouter["sessions"]["getSessions"]
>[0];
