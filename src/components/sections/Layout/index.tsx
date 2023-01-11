import { Center, Container, useBreakpointValue } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { Header } from "../../../components/Header";
import { NavigationTabs, TabItem } from "../../../components/NavigationTabs";

interface Props {
  children: React.ReactNode;
}

interface WrapperProps extends Props {
  isAuthenticated: boolean;
}

const Wrapper = ({ children, isAuthenticated }: WrapperProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (isMobile || isAuthenticated) {
    return (
      <Container w="full" maxW="container.md" px={[0, 4]}>
        {children}
      </Container>
    );
  }

  return (
    <Container
      as={Center}
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      maxW="md"
    >
      {children}
    </Container>
  );
};

export const Layout = ({ children }: Props) => {
  const session = useSession();
  const router = useRouter();
  const isAuthenticated = session.status === "authenticated";
  return (
    <>
      <Header />
      <Wrapper isAuthenticated={isAuthenticated}>
        {isAuthenticated && (
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
      </Wrapper>
    </>
  );
};
