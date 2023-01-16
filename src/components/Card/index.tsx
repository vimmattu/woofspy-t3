import { ChevronRightIcon } from "@chakra-ui/icons";
import { Button, Flex, LinkBox, Spacer } from "@chakra-ui/react";
import NextLink from "next/link";

interface Props {
  children: React.ReactNode;
  actionIcon?: React.ReactNode;
  actionText?: string;
  href?: string;
}

export const Card: React.FC<Props> = ({
  children,
  href,
  actionIcon,
  actionText,
}) => (
  <Flex
    as={LinkBox}
    alignItems="center"
    borderWidth="thin"
    borderStyle="solid"
    borderColor="gray.200"
    borderRadius="md"
    shadow="xs"
    p={2}
    mb={2}
  >
    {children}
    {href && (
      <>
        <Spacer />
        <Button as={NextLink} href={href} variant="outline">
          {actionText} {actionIcon || <ChevronRightIcon />}
        </Button>
      </>
    )}
  </Flex>
);
