import { Link, Button, Heading, Spinner } from "@chakra-ui/react";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useSessions } from "../hooks/sessions";
import { Head } from "../components/Head";
import { SessionList } from "../components/SessionList";
import { MainContentContainer } from "../components/MainContentContainer";

const Home: NextPage = () => {
  const { data: endedSessions, isLoading: isLoadingEndedSessions } =
    useSessions({ hasEnded: true });
  const { data: activeSessions, isLoading: isLoadingActiveSessions } =
    useSessions({ isActive: true });

  if (isLoadingEndedSessions || isLoadingActiveSessions) return <Spinner />;

  return (
    <>
      <MainContentContainer>
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
          m="auto !important"
        >
          Start spy
        </Button>

        {Object.keys(activeSessions).length && (
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
      </MainContentContainer>
    </>
  );
};

export default Home;
