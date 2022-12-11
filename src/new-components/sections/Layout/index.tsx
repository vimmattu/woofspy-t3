import { Container } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import { Header } from "../../components/Header";
import { NavigationTabs, TabItem } from "../../components/NavigationTabs";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const session = useSession();
  return (
    <>
      <Header />
      <Container w="full" maxW="container.md" px={[0, 4]}>
        {session.status === "authenticated" && (
          <NavigationTabs>
            <TabItem title="Spy" href="/" active />
            <TabItem title="History" href="/sessions" />
            <TabItem title="Settings" href="/settings" />
          </NavigationTabs>
        )}
        {children}
      </Container>
    </>
  );
};
