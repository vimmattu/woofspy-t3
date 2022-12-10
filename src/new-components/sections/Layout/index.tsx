import { Container } from "@chakra-ui/react";
import React from "react";
import { Header } from "../../components/Header";
import { NavigationTabs, TabItem } from "../../components/NavigationTabs";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  return (
    <>
      <Header userName="John Doe" />
      <Container w="full" maxW="container.md" px={[0, 4]}>
        <NavigationTabs>
          <TabItem title="Spy" href="/" active />
          <TabItem title="History" href="/history" />
          <TabItem title="Settings" href="/settings" />
        </NavigationTabs>
        {children}
      </Container>
    </>
  );
};
