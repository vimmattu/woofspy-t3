import { t, authedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { hash } from "argon2";

export const authRouter = t.router({
  getSession: t.procedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: authedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
  createUser: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        passwordConfirm: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.prisma.user.findFirst({
        where: { email: input.email },
      });
      if (existingUser)
        throw new TRPCError({
          code: "BAD_REQUEST",
        });

      if (input.password !== input.passwordConfirm)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords do not match",
        });

      const hashedPassword = await hash(input.password);

      return ctx.prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
        },
      });
    }),
});
