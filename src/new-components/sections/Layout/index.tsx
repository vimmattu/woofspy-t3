import { Container } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { Header } from "../../components/Header";
import { NavigationTabs, TabItem } from "../../components/NavigationTabs";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const session = useSession();
  const router = useRouter();
  return (
    <>
      <Header />
      <Container w="full" maxW="container.md" px={[0, 4]}>
        {session.status === "authenticated" && (
          <NavigationTabs>
            <TabItem
              title="Dashboard"
              href="/"
              active={router.pathname === "/"}
            />
            <TabItem
              title="Spy"
              href="/spy"
              active={router.pathname.startsWith("/spy")}
            />
            <TabItem
              title="History"
              href="/history"
              active={router.pathname.startsWith("/history")}
            />
          </NavigationTabs>
        )}
        {children}
      </Container>
    </>
  );
};
