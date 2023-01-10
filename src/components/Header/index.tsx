import {
  Avatar,
  Button,
  Flex,
  Icon,
  Link,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useSession, signOut } from "next-auth/react";
import { GiSpy } from "react-icons/gi";

export const Header = () => {
  const session = useSession();

  const name =
    session.data?.user?.name || session.data?.user?.email || undefined;
  const image = session.data?.user?.image || undefined;

  return (
    <Flex as="header" shadow={["", "md"]} p={2} alignItems="center" mb={[0, 2]}>
      <Link as={NextLink} href="/" fontSize="xl" fontWeight="bold">
        <Text as="span" display="flex" alignItems="center">
          <Icon as={GiSpy} mr={1} boxSize={12} /> woofspy
        </Text>
      </Link>
      <Spacer />
      {session.status === "authenticated" && (
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <Button rounded="full" variant="link" cursor="pointer" minW={0}>
              <Avatar name={name} size={["sm", "md"]} src={image} />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>
              <Text fontWeight="bold">{name}</Text>
            </PopoverHeader>
            <PopoverContent p={4}>
              <Button
                onClick={() => signOut()}
                colorScheme="gray"
                variant="outline"
              >
                Sign out
              </Button>
            </PopoverContent>
          </PopoverContent>
        </Popover>
      )}
    </Flex>
  );
};
