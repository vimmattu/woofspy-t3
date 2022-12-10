import { Container } from "@chakra-ui/react";
import { Header } from "../../new-components/Header";
import { NavigationTabs } from "../../new-components/NavigationTabs";

export const PageTopSection = () => {
  return (
    <>
      <Header userName="John Doe" />
      <Container maxW={["full", "container.md"]}>
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
