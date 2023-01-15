import { Link, Button, Heading, VStack, Spinner } from "@chakra-ui/react";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useSessions } from "../hooks/sessions";
import { Head } from "../components/Head";
import { SessionList } from "../components/SessionList";

const Home: NextPage = () => {
  const { data: endedSessions, isLoading: isLoadingEndedSessions } =
    useSessions({ hasEnded: true });
  const { data: activeSessions, isLoading: isLoadingActiveSessions } =
    useSessions({ isActive: true });

  if (isLoadingEndedSessions || isLoadingActiveSessions) return <Spinner />;

  return (
    <>
      <VStack as="main" mt={4}>
        <Head title="Dashboard" hasHiddenHeader />

        <Button
          as={NextLink}
          href="/spy"
          colorScheme="red"
          w="40"
          h="40"
          borderRadius="full"
          fontSize="xl"
          shadow="lg"
          m={8}
        >
          Start spy
        </Button>

        {activeSessions && (
          <Heading as="h2" w="full" size="lg">
            Active sessions
          </Heading>
        )}
        {isLoadingActiveSessions ? (
          <Spinner />
        ) : (
          activeSessions && (
            <>
              <SessionList sessions={activeSessions} />
            </>
          )
        )}

        <Heading as="h2" w="full" size="lg">
          Past sessions
        </Heading>
        {isLoadingEndedSessions ? (
          <Spinner />
        ) : (
          endedSessions && (
            <>
              <SessionList sessions={endedSessions} />
              <Link color="blue.400" as={NextLink} href="/history">
                View more
              </Link>
            </>
          )
        )}
      </VStack>
    </>
  );
};

export default Home;
