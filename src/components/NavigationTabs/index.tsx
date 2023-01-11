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
  children: React.ReactNode;
}

export const NavigationTabs = ({ children }: Props) => {
  return (
    <Flex
      as="nav"
      w="full"
      justifyContent="space-between"
      borderBottom="gray"
      borderBottomWidth="thin"
      borderBottomStyle="solid"
    >
      {children}
    </Flex>
  );
};

export const TabItem = ({ href, title, active }: Tab) => {
  const bgGradient = "linear(to-b, white, gray.100)";
  return (
    <Link
      as={NextLink}
      href={href}
      fontSize="xl"
      textAlign="center"
      w="full"
      borderRadius="sm"
      borderBottomRadius="none"
      bgGradient={active ? bgGradient : "none"}
      _hover={{ textDecoration: "none", bgGradient }}
      p={2}
    >
      {title}
    </Link>
  );
};
