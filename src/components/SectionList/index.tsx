import { Box, Text } from "@chakra-ui/react";
import { SessionCard } from "../SessionCard";
import type { Session } from "../../types/inferred";
import { Fragment } from "react";

interface Props {
  sessions: Record<string, Session[]>;
}

export const SessionList = ({ sessions }: Props) => {
  return (
    <Box w="full">
      {Object.entries(sessions).map(([date, sessions]) => (
        <Fragment key={date}>
          <Text fontWeight="bold" fontSize="xl" mb={2}>
            {date}
          </Text>
          {sessions.map((s) => (
            <SessionCard
              id={s.id}
              startTime={s.startTime}
              endTime={s.endTime || undefined}
              eventCount={s._count.recordings}
              key={s.id}
            />
          ))}
        </Fragment>
      ))}
    </Box>
  );
};
