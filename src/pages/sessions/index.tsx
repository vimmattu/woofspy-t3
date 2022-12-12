import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { useInfiniteSessions } from "../../hooks/sessions";
import { Button, Heading, Spinner, VStack } from "@chakra-ui/react";
import { SessionList } from "../../new-components/components/SectionList";

const Sessions: NextPage = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteSessions();

  return (
    <>
      <Head>
        <title>History</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VStack as="main" mt={4}>
        <Heading as="h2" w="full" size="lg">
          History
        </Heading>

        {isLoading ? (
          <Spinner />
        ) : (
          data && (
            <>
              <SessionList sessions={data} />
              {hasNextPage && (
                <>
                  {!isFetchingNextPage ? (
                    <Button
                      color="blue.400"
                      variant="link"
                      onClick={() => fetchNextPage()}
                    >
                      Load more
                    </Button>
                  ) : (
                    <Spinner />
                  )}
                </>
              )}
            </>
          )
        )}
      </VStack>
    </>
  );
};

export default Sessions;
