import type { NextPage } from "next";
import React from "react";
import { useInfiniteSessions } from "../../hooks/sessions";
import { Button, Spinner } from "@chakra-ui/react";
import { SessionList } from "../../components/SessionList";
import { Head } from "../../components/Head";
import { MainContentContainer } from "../../components/MainContentContainer";

const Sessions: NextPage = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteSessions();

  return (
    <MainContentContainer>
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
    </MainContentContainer>
  );
};

export default Sessions;
