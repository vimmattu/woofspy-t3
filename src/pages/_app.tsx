// src/pages/_app.tsx
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { Layout } from "../components/sections/Layout";
import { AuthGuard } from "../components/AuthGuard";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../styles/theme";
import "@fontsource/comic-neue/300.css";
import "@fontsource/comic-neue/400.css";
import "@fontsource/comic-neue/700.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={session}>
        <Layout>
          <AuthGuard>
            <Component {...pageProps} />
          </AuthGuard>
        </Layout>
      </SessionProvider>
    </ChakraProvider>
  );
};

export default trpc.withTRPC(MyApp);
