import {
  Button,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "../../../server/trpc/router";
import { SessionCard } from "../SessionCard";

type InferredSessionType = inferProcedureOutput<
  AppRouter["sessions"]["getSessions"]
>[""];

interface Props {
  sessions: Record<string, InferredSessionType>;
}

export const SessionList = ({ sessions }: Props) => {
  return (
    <>
      {Object.entries(sessions).map(([date, sessions]) => (
        <>
          <Text fontWeight="bold" fontSize="xl" mb={2}>
            {date}
          </Text>
          {sessions.map((s) => (
            <SessionCard
              id={s.id}
              startTime={s.startTime}
              endTime={s.endTime || undefined}
              eventCount={s.recordings.length}
              key={s.id}
            />
          ))}
        </>
      ))}
      {/*
    {Object.entries(sessions).map(([date, s]) => (
      <Heading>{date}</Heading>

    )}
      */}
    </>
  );
};
