import { Link, Button, Heading, VStack, Spinner } from "@chakra-ui/react";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useSessions } from "../hooks/sessions";
import { Head } from "../new-components/components/Head";
import { SessionList } from "../new-components/components/SectionList";

const Home: NextPage = () => {
  const { data, isLoading } = useSessions();

  // Display spinner if fetching user data or active session is in loading state,
  // or if an active session is found. (If active session is found, then useActiveSession redirects user to session details)
  // TODO: Replace null with spinner
  // if (!shouldRender || isFetchingActiveSession || !!activeSession) return null;

  return (
    <>
      <VStack as="main" mt={4}>
        <Head title="Dashboard" />
        <Button as={NextLink} href="/spy" colorScheme="green" w="full">
          Start spy
        </Button>

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
