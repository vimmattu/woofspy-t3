import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { useGroups } from "../../hooks/groups";
import { Card } from "../Card";

export const GroupList = () => {
  const { isLoading, data } = useGroups();

  if (isLoading) return <Spinner />;

  return (
    <Box w="full">
      {data?.map((group) => (
        <Card
          key={group.id}
          href={`/settings/group/${group.id}`}
          actionText="Edit"
        >
          <VStack>
            <Text fontWeight="bold" w="full">
              {group.name}
            </Text>
            <Text w="full">{group.users.length} users</Text>
          </VStack>
        </Card>
      ))}
    </Box>
  );
};
