import { Box, Divider, Flex, IconButton, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
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
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Flex minH={isLast ? 12 : 16} w="full">
      <Box ml={8}>
        <CalendarIcon boxSize={8} ml="-16px" zIndex={1} bg="white" />
        <Divider opacity={1} orientation="vertical" />
      </Box>
      <Flex justifyContent="space-between" ml={2} mt={1.5} w="full">
        <Text>16:52 - Recorded event</Text>
        <IconButton
          aria-label="Expand event"
          icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          h="min"
          w="min"
          minW={0}
          variant="unstyled"
          size="lg"
          onClick={() => setIsExpanded((prev) => !prev)}
        />
      </Flex>
    </Flex>
  );
};
