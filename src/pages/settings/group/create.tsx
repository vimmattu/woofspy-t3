import type { NextPage } from "next";
import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { Head } from "../../../components/Head";
import { GroupForm } from "../../../components/GroupForm";
import { useCreateGroup } from "../../../hooks/groups";
import { useRouter } from "next/router";
import { MainContentContainer } from "../../../components/MainContentContainer";

const Settings: NextPage = () => {
  const { mutate: createGroup, isLoading } = useCreateGroup();
  const { back } = useRouter();

  return (
    <MainContentContainer>
      <Box w="full">
        <Button variant="outline" onClick={back}>
          Back
        </Button>
      </Box>
      <Head title="Create group" />
      <GroupForm onSubmit={createGroup} isSubmitting={isLoading} />
    </MainContentContainer>
  );
};

export default Settings;
