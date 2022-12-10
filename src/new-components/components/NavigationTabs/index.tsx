import { Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";

interface Tab {
  href: string;
  title: string;
  active?: boolean;
}

interface Props {
  /**
   * Tabs to be displayed. Each tab must be given a href and a title, and optionally a tab can be flagged as active.
   */
  tabs: Tab[];
}

export const NavigationTabs = ({ tabs }: Props) => {
  return (
    <Flex
      as="nav"
      w="full"
      justifyContent="space-between"
      borderBottom="gray"
      borderBottomWidth="thin"
      borderBottomStyle="solid"
    >
      {tabs.map((tab) => (
        <TabItem key={tab.href} {...tab} />
      ))}
    </Flex>
  );
};

const TabItem = ({ href, title, active }: Tab) => {
  return (
    <Link
      as={NextLink}
      href={href}
      fontSize="xl"
      textAlign="center"
      w="full"
      borderRadius="sm"
      borderBottomRadius="none"
      bg={active ? "gray.50" : "none"}
      _hover={{ textDecoration: "none", bg: "gray.50" }}
      p="0.5rem"
    >
      {title}
    </Link>
  );
};
