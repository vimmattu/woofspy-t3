import {
  Avatar,
  Button,
  Flex,
  Link,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useSession, signOut } from "next-auth/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { LogoIcon } from "../icons/Logo";

export const Header = () => {
  const session = useSession();
  const { colorMode, toggleColorMode } = useColorMode();

  const name =
    session.data?.user?.name || session.data?.user?.email || undefined;
  const image = session.data?.user?.image || undefined;

  return (
    <Flex as="header" shadow={["", "md"]} p={2} alignItems="center" mb={[0, 2]}>
      <Link as={NextLink} href="/" fontSize="xl" fontWeight="bold">
        <Text as="span" display="flex" alignItems="center">
          {/*<Icon as={GiSpy} mr={1} boxSize={12} /> woofspy*/}
          <LogoIcon /> woofspy
        </Text>
      </Link>
      <Spacer />
      <Button onClick={toggleColorMode} variant="ghost">
        {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      </Button>
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
