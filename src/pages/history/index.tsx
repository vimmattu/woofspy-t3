import type { NextPage } from "next";
import React from "react";
import { useInfiniteSessions } from "../../hooks/sessions";
import { Button, Spinner, VStack } from "@chakra-ui/react";
import { SessionList } from "../../new-components/components/SectionList";
import { Head } from "../../new-components/components/Head";

const Sessions: NextPage = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteSessions();

  return (
    <>
      <VStack as="main" mt={4} mb={8}>
        <Head title="History" />

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
                      colorScheme="gray"
                      onClick={() => fetchNextPage()}
                      fontWeight="normal"
                      w="full"
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
