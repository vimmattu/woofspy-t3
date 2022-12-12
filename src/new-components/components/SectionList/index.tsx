import { Box, Text } from "@chakra-ui/react";
import { SessionCard } from "../SessionCard";
import type { Session } from "../../../types/inferred";

interface Props {
  sessions: Record<string, Session[]>;
}

export const SessionList = ({ sessions }: Props) => {
  return (
    <Box w="full">
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
    </Box>
  );
};
