import { Badge, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import dayjs from "dayjs";
import { Card } from "../Card";
import Link from "next/link";

interface Props {
  id: string;
  startTime: Date;
  endTime?: Date;
  eventCount: number;
  groupId?: string;
  groupName?: string;
}

const formatTime = (date: Date) => dayjs(date).format("HH:mm:ss");

export const SessionCard = ({
  id,
  startTime,
  endTime,
  eventCount,
  groupName,
  groupId,
}: Props) => {
  const href = endTime ? `/sessions/${id}` : `/spy/${id}`;
  const displayBadge = !!groupId && !!groupName;

  return (
    <Card href={href} actionText={!endTime ? "View live" : ""}>
      <VStack w="full" spacing={4} textAlign="left">
        <Text fontWeight="bold" w="full">
          {formatTime(startTime)} -{" "}
          {endTime ? formatTime(endTime) : "still spying"}{" "}
        </Text>
        <HStack w="full">
          <Text>{eventCount} detected events</Text>
          {displayBadge && (
            <Text>
              <Badge
                as={Link}
                href={`/settings/group/${groupId}`}
                colorScheme="yellow"
              >
                {groupName}
              </Badge>
            </Text>
          )}
        </HStack>
      </VStack>
    </Card>
  );
};
