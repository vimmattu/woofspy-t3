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
import dayjs from "dayjs";

interface Props {
  id: string;
  startTime: Date;
  endTime: Date;
  eventCount: number;
}

const formatTime = (date: Date) => dayjs(date).format("HH:mm:ss");

export const SessionCard = ({ id, startTime, endTime, eventCount }: Props) => {
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
          {formatTime(startTime)} - {formatTime(endTime)}
        </Text>
        <Text w="full">{eventCount} detected events</Text>
      </VStack>
      <Spacer />
      <NextLink href={id} passHref>
        <LinkOverlay>
          <Button variant="outline">
            <ChevronRightIcon />
          </Button>
        </LinkOverlay>
      </NextLink>
    </Flex>
  );
};
