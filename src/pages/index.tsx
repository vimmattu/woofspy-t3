import { Link, Button, Heading, VStack, Spinner } from "@chakra-ui/react";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useSessions } from "../hooks/sessions";
import { Head } from "../components/Head";
import { SessionList } from "../components/SessionList";
// import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  // const { mutate: closeActive } =
  //   trpc.sessions.closeActiveSessions.useMutation();
  const { data, isLoading } = useSessions();

  // Display spinner if fetching user data or active session is in loading state,
  // or if an active session is found. (If active session is found, then useActiveSession redirects user to session details)
  // TODO: Replace null with spinner
  // if (!shouldRender || isFetchingActiveSession || !!activeSession) return null;
  // const { data: activeSession, isLoading: isFetchingActiveSession } =
  //   useActiveSession();

  // if (isFetchingActiveSession) return <Spinner />;

  return (
    <>
      <VStack as="main" mt={4}>
        <Head title="Dashboard" hasHiddenHeader />

        {false ? (
          <Button
            as={NextLink}
            href="/spy"
            colorScheme="red"
            variant="outline"
            borderWidth="medium"
            w="40"
            h="40"
            borderRadius="full"
            fontSize="xl"
            shadow="lg"
            m={8}
            color="black"
            borderColor="red.600"
            bg="red.50"
          >
            View spy
          </Button>
        ) : (
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
        )}

        {/* activeSession && (
          <Button onClick={() => closeActive()}>close active</Button>
        ) */}
        <Heading as="h2" w="full" size="lg">
          Past sessions
        </Heading>

        {isLoading ? (
          <Spinner />
        ) : (
          data && (
            <>
              <SessionList sessions={data} />
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
