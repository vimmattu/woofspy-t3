import { Text, VStack } from "@chakra-ui/react";
import React from "react";
import dayjs from "dayjs";
import { Card } from "../Card";

interface Props {
  id: string;
  startTime: Date;
  endTime?: Date;
  eventCount: number;
}

const formatTime = (date: Date) => dayjs(date).format("HH:mm:ss");

export const SessionCard = ({ id, startTime, endTime, eventCount }: Props) => {
  const href = endTime ? `/sessions/${id}` : `/spy/${id}`;
  return (
    <Card href={href} actionText={!endTime ? "View live" : ""}>
      <VStack spacing={4} textAlign="left">
        <Text fontWeight="bold" w="full">
          {formatTime(startTime)} -{" "}
          {endTime ? formatTime(endTime) : "still spying"}
        </Text>
        <Text w="full">{eventCount} detected events</Text>
      </VStack>
    </Card>
  );
};
