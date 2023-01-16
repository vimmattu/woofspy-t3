import type { NextPage } from "next";
import React from "react";
import { Box, Button, Spinner } from "@chakra-ui/react";
import { Head } from "../../../components/Head";
import { GroupForm } from "../../../components/GroupForm";
import { useGroup, useUpdateGroup } from "../../../hooks/groups";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { MainContentContainer } from "../../../components/MainContentContainer";

const Settings: NextPage = () => {
  const session = useSession();
  const { query, back } = useRouter();
  const id = query.id as string;
  const { data, isLoading: isLoading } = useGroup(id);
  const { mutate: createGroup, isLoading: isSubmitting } = useUpdateGroup();

  const selectedByDefault =
    data?.users.find(({ user }) => user.email === session?.data?.user?.email)
      ?.selectByDefault || false;
  const defaultEmails = data?.users.map(({ user }) => user.email ?? "");

  return (
    <MainContentContainer>
      <Box w="full">
        <Button variant="outline" onClick={back}>
          Back
        </Button>
      </Box>
      <Head title="Edit group" />
      {isLoading ? (
        <Spinner />
      ) : (
        <GroupForm
          onSubmit={(data) => createGroup({ ...data, id })}
          isSubmitting={isSubmitting}
          isEdit
          defaultName={data?.name}
          defaultSelected={selectedByDefault}
          defaultEmails={defaultEmails}
        />
      )}
    </MainContentContainer>
  );
};

export default Settings;
