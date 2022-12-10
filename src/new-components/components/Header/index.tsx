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
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";

interface Props {
  /**
   * Name to display on user avatar
   */
  userName?: string;
  /**
   * Picture of user to display on user avatar
   */
  userImage?: string;
  /**
   * Callback function for logout
   */
  onLogout?: () => void;
}

export const Header = ({ userImage, userName, onLogout }: Props) => {
  return (
    <Flex as="header" shadow={["", "md"]} p={2} alignItems="center" mb={[0, 2]}>
      <Link as={NextLink} href="/" fontSize="xl" fontWeight="bold">
        Logo
      </Link>
      <Spacer />
      <Popover placement="bottom-start">
        <PopoverTrigger>
          <Button rounded="full" variant="link" cursor="pointer" minW={0}>
            <Avatar name={userName} size={["sm", "md"]} src={userImage} />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            <Text fontWeight="bold">{userName}</Text>
          </PopoverHeader>
          <PopoverContent p={4}>
            <Button onClick={onLogout} colorScheme="gray" variant="outline">
              Sign out
            </Button>
          </PopoverContent>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};
