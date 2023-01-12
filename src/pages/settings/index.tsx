import type { NextPage } from "next";
import React from "react";
import { Button, FormControl, Heading, Input, VStack } from "@chakra-ui/react";
import { Head } from "../../components/Head";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const Settings: NextPage = () => {
  const router = useRouter();
  const { data } = trpc.groups.getGroups.useQuery();
  const [name, setName] = React.useState<string>("");
  const { mutateAsync } = trpc.groups.createGroup.useMutation();

  return (
    <>
      <VStack as="main" mt={4}>
        <Head title="Settings" />

        <Heading as="h2" w="full" fontSize="2xl">
          Groups
        </Heading>

        <FormControl>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Group name"
          />
        </FormControl>
        <Button
          onClick={() => {
            mutateAsync({
              name,
              emails: ["test@example.com", "hello@test.com"],
            });
          }}
          w="full"
        >
          Create
        </Button>
      </VStack>
    </>
  );
};

export default Settings;
