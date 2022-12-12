import {
  Box,
  Button,
  Flex,
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
import type { Session } from "../../../types/inferred";

interface Props {
  session: Session;
}

const formatDate = (date: Date) => dayjs(date).format("DD:MM:YYYY");
const formatTime = (date: Date) => dayjs(date).format("HH:mm:ss");

export const SessionDetail = ({ session }: Props) => {
  return (
    <Box>
      <Flex>
        <Text>{formatDate(session.startTime)}</Text>
        <Text>
          {formatTime(session.startTime)} -{" "}
          {session.endTime ? formatTime(session.endTime) : ""}
        </Text>
      </Flex>
    </Box>
  );
};
