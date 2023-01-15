import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../server/trpc/router";

export type Session = inferProcedureOutput<
  AppRouter["spySessions"]["getSessions"]
>["sessions"][0];

export type Recording = inferProcedureOutput<
  AppRouter["recordings"]["getRecordings"]
>["recordings"][0];
