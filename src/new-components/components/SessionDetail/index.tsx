import { Box, Divider, Flex, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { CalendarIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";
import type { Session } from "../../../types/inferred";

interface Props {
  session: Session;
}

const formatDate = (date: Date) => dayjs(date).format("DD.MM.YYYY");
const formatTime = (date: Date) => dayjs(date).format("HH:mm:ss");

export const SessionDetail = ({ session }: Props) => {
  return (
    <Box>
      <Flex justifyContent="space-between" mb={4}>
        <Text fontWeight="bold" fontSize="xl">
          {formatDate(session.startTime)}
        </Text>
        <Text fontSize="xl">
          {formatTime(session.startTime)} -{" "}
          {session.endTime ? formatTime(session.endTime) : ""}
        </Text>
      </Flex>
      <VStack w="full">
        {session.recordings.map((recording, i) => (
          <RecordingItem
            key={recording.id}
            isLast={i === session.recordings.length - 1}
          />
        ))}
      </VStack>
    </Box>
  );
};

interface RecordingItemProps {
  isLast?: boolean;
}

const RecordingItem = ({ isLast }: RecordingItemProps) => {
  return (
    <Flex minH={isLast ? 12 : 16} w="full">
      <Box ml={8}>
        <CalendarIcon boxSize={8} ml="-16px" zIndex={1} bg="white" />
        <Divider opacity={1} orientation="vertical" />
      </Box>
      <Box>
        <Text>Recorded event</Text>
      </Box>
    </Flex>
  );
};
