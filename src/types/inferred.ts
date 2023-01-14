import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../server/trpc/router";

export type Session = inferProcedureOutput<
  AppRouter["sessions"]["getSessions"]
>["sessions"][0];

export type Recording = inferProcedureOutput<
  AppRouter["sessions"]["getRecordings"]
>[0];
