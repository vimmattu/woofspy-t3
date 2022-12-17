import type { NextPage } from "next";
import React from "react";
import { useSessionDetails } from "../../hooks/sessions";
import { Button, Spinner, VStack } from "@chakra-ui/react";
import { Head } from "../../new-components/components/Head";
import { SessionDetail } from "../../new-components/components/SessionDetail";
import { useRouter } from "next/router";

const Sessions: NextPage = () => {
  const {
    query: { id },
    back,
  } = useRouter();
  const { data, isLoading } = useSessionDetails(id as string);

  return (
    <>
      <VStack as="main" mt={4}>
        <Head title="Session detail" hasHiddenHeader />

        <Button alignSelf="start" variant="outline" onClick={back}>
          Back
        </Button>

        {isLoading && <Spinner />}
        {data && <SessionDetail session={data} />}
      </VStack>
    </>
  );
};

export default Sessions;
