import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../server/trpc/router";

export type InferredSessionType = NonNullable<
  inferProcedureOutput<AppRouter["sessions"]["getSession"]>
>;
