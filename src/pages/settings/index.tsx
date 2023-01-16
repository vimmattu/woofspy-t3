import type { NextPage } from "next";
import React from "react";
import { Button, Heading } from "@chakra-ui/react";
import { Head } from "../../components/Head";
import { GroupList } from "../../components/GroupList";
import Link from "next/link";
import { MainContentContainer } from "../../components/MainContentContainer";

const Settings: NextPage = () => {
  return (
    <MainContentContainer>
      <Head title="Settings" />

      <Heading as="h2" w="full" fontSize="2xl">
        Groups
      </Heading>

      <Button
        as={Link}
        href="/settings/group/create"
        w="fit-content"
        colorScheme="green"
      >
        Create group
      </Button>
      <GroupList />
    </MainContentContainer>
  );
};

export default Settings;
