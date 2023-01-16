import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";
import type { Session, Recording } from "../../types/inferred";
import { useRecordings, useRecordingFile } from "../../hooks/recordings";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Props {
  session: Session;
}

const formatDate = (date: Date) => dayjs(date).format("DD.MM.YYYY");
const formatTime = (date: Date) => dayjs(date).format("HH:mm:ss");

export const SessionDetail = ({ session }: Props) => {
  const authSession = useSession();
  const {
    data: recordings,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useRecordings(session.id);

  if (isLoading || !recordings) {
    return <Spinner />;
  }

  return (
    <Box w="full">
      {session.group && (
        <Text>
          Session started by{" "}
          {session.user?.id === authSession.data?.user?.id
            ? "you"
            : session.user?.name ?? session.user?.email}{" "}
          in group{" "}
          <Badge
            as={Link}
            href={`/settings/group/${session.group?.id}`}
            colorScheme="yellow"
          >
            {session.group?.name}
          </Badge>
        </Text>
      )}
      <Flex justifyContent="space-between" mb={4}>
        <Text fontWeight="bold" fontSize="xl">
          {formatDate(session.startTime)}
        </Text>
        <Text fontSize="xl">
          {" "}
          {formatTime(session.startTime)} -{" "}
          {session.endTime ? formatTime(session.endTime) : ""}
        </Text>
      </Flex>{" "}
      <VStack w="full" mb={8}>
        {recordings.map((recording, i) => (
          <RecordingItem
            key={recording.id}
            isLast={i === recordings.length - 1}
            recording={recording}
          />
        ))}
        {hasNextPage && (
          <>
            {!isFetchingNextPage ? (
              <Button
                colorScheme="gray"
                onClick={() => fetchNextPage()}
                fontWeight="normal"
                w="full"
                zIndex={1}
              >
                Load more
              </Button>
            ) : (
              <Spinner />
            )}
          </>
        )}
      </VStack>
    </Box>
  );
};

interface RecordingItemProps {
  isLast?: boolean;
  recording: Recording;
}

const RecordingItem = ({ isLast, recording }: RecordingItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data } = useRecordingFile(recording.id);
  return (
    <Flex minH={isLast ? 12 : 16} w="full">
      <Box ml={8}>
        <CalendarIcon boxSize={8} ml="-16px" zIndex={1} bg="white" />
        <Divider opacity={1} orientation="vertical" />
      </Box>
      <Box w="full">
        <Flex justifyContent="space-between" ml={2} mt={1.5} w="full">
          <Text>{formatTime(recording.startTime)} - Recorded event</Text>
          <IconButton
            aria-label="Expand event"
            icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            variant="outline"
            onClick={() => setIsExpanded((prev) => !prev)}
          />
        </Flex>
        {data && isExpanded && (
          <Box p={4} w="full">
            <video src={data} autoPlay controls />
          </Box>
        )}
      </Box>
    </Flex>
  );
};
