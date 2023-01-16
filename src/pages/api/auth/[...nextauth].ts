import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";
import {
  addUserToGroup,
  deleteInvitation,
  getAcceptedInvitationsByEmail,
} from "../../../server/trpc/service/group.service";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  events: {
    async signIn({ user }) {
      const invitations = await getAcceptedInvitationsByEmail(user.email!);
      await Promise.all(
        invitations.map((invitation) =>
          addUserToGroup(user.id!, invitation.groupId)
        )
      );
      Promise.all(
        invitations.map((invitation) => deleteInvitation(invitation.token))
      );
    },
  },
  callbacks: {
    async signIn({ user }) {
      return env.DEV || user.isAdmin;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GCP_CLIENT_ID,
      clientSecret: env.GCP_CLIENT_SECRET,
    }),
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: Number(env.EMAIL_SERVER_PORT),
        auth: {
          user: env.EMAIL_SERVER_USERNAME,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
