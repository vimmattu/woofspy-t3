import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  LinkBox,
  LinkOverlay,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { ChevronRightIcon } from "@chakra-ui/icons";

interface Props {
  startTime: Date;
  endTime: Date;
  eventCount: number;
}

export const SessionCard = ({ startTime, endTime, eventCount }: Props) => {
  return (
    <Flex
      as={LinkBox}
      alignItems="center"
      borderWidth="thin"
      borderStyle="solid"
      borderColor="gray.200"
      borderRadius="md"
      shadow="xs"
      p="0.5rem"
    >
      <VStack spacing={4} textAlign="left">
        <Text fontWeight="bold" w="full">
          {startTime.toLocaleTimeString()} - {endTime.toLocaleTimeString()}
        </Text>
        <Text w="full">{eventCount} detected events</Text>
      </VStack>
      <Spacer />
      <LinkOverlay>
        <Button variant="outline">
          <ChevronRightIcon />
        </Button>
      </LinkOverlay>
    </Flex>
  );
};
