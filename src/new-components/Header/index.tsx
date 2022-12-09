import {
  Avatar,
  Flex,
  Link,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";

interface Props {
  userName?: string;
}

export const Header = ({ userName }: Props) => {
  return (
    <Flex shadow={["", "md"]} p="0.5rem" alignItems="center">
      <Link as={NextLink} href="/" fontSize="xl">
        Logo
      </Link>
      <Spacer />
      <Popover>
        <PopoverTrigger>
          <Avatar name={userName} size="md" _hover={{ cursor: "pointer" }} />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>{userName}</PopoverHeader>
          <PopoverContent>Todo</PopoverContent>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};
