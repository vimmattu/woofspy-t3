import type { NextPage } from "next";
import React from "react";
import { Box, Button, Heading, VStack } from "@chakra-ui/react";
import { Head } from "../../components/Head";
import { GroupList } from "../../components/GroupList";
import Link from "next/link";

const Settings: NextPage = () => {
  return (
    <>
      <VStack as="main" mt={4}>
        <Head title="Settings" />

        <Heading as="h2" w="full" fontSize="2xl">
          Groups
        </Heading>

        <Box as={Link} href="/settings/group/create" w="full">
          <Button colorScheme="green">Create group</Button>
        </Box>
        <GroupList />
      </VStack>
    </>
  );
};

export default Settings;
