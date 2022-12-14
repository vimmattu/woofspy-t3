import { Box, Flex, Text } from "@chakra-ui/react";
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
      <Flex justifyContent="space-between">
        <Text fontWeight="bold" fontSize="xl">
          {formatDate(session.startTime)}
        </Text>
        <Text fontSize="xl">
          {formatTime(session.startTime)} -{" "}
          {session.endTime ? formatTime(session.endTime) : ""}
        </Text>
      </Flex>
      <Box>
        <CalendarIcon />
      </Box>
    </Box>
  );
};
