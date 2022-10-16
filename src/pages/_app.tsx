// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import Layout from "../components/Layout";
import { AuthGuard } from "../components/AuthGuard";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      </Layout>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
