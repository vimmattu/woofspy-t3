import { Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

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

export const TabItem = ({ href, title }: Tab) => {
  const router = useRouter();

  const active = router.pathname === href;

  return (
    <Link
      as={NextLink}
      href={href}
      fontSize="xl"
      textAlign="center"
      w="full"
      borderRadius="sm"
      borderBottomRadius="none"
      bg={active ? "gray.100" : "none"}
      _hover={{ textDecoration: "none", bg: "gray.100" }}
      p={2}
    >
      {title}
    </Link>
  );
};
