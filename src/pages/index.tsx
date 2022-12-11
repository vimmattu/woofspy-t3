import { Link, Button, Heading, VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { SessionList } from "../new-components/components/SectionList";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const router = useRouter();
  const { data, isLoading } = trpc.sessions.getSessions.useQuery({ length: 4 });

  // Display spinner if fetching user data or active session is in loading state,
  // or if an active session is found. (If active session is found, then useActiveSession redirects user to session details)
  // TODO: Replace null with spinner
  // if (!shouldRender || isFetchingActiveSession || !!activeSession) return null;

  return (
    <>
      <Head>
        <title>Woofspy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VStack as="main" mt={4}>
        <Button as={NextLink} href="/spy" colorScheme="green" w="full">
          Start spy
        </Button>

        <Heading as="h2" w="full" size="lg">
          Past sessions
        </Heading>

        {data && (
          <>
            <SessionList sessions={data} />
            <Link color="blue.400" as={NextLink} href="/sessions">
              View more
            </Link>
          </>
        )}
      </VStack>
    </>
  );
};

export default Home;
