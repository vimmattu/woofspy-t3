import { Flex, LinkBox, Spacer } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const Card: React.FC<Props> = ({ children, action }) => (
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
    {action && (
      <>
        <Spacer />
        {action}
      </>
    )}
  </Flex>
);
