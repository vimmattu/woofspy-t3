import { Container } from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { NavigationTabs } from "../../components/NavigationTabs";

export const PageTopSection = () => {
  return (
    <>
      <Header userName="John Doe" />
      <Container w="full" maxW="container.md" px={[0, 4]}>
        <NavigationTabs
          tabs={[
            { href: "/", title: "Spy", active: true },
            { href: "/history", title: "History" },
            { href: "/settings", title: "Settings" },
          ]}
        />
      </Container>
    </>
  );
};
