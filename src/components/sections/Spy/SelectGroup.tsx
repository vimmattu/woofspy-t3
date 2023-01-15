import { Head } from "../../Head";
import { Button, Select, Spinner, Text } from "@chakra-ui/react";
import { useSelectedGroup, useSpySetup } from "../../../hooks/spy";
import { useGroups } from "../../../hooks/groups";
import { useEffect } from "react";

const SelectGroup: React.FC = () => {
  const { goToNextStep } = useSpySetup();
  const { data, isLoading } = useGroups();
  const [selectedGroup, setSelectedGroup] = useSelectedGroup();

  useEffect(() => {
    const defaultGroup = data?.find((group) =>
      group.users.find((user) => user.selectByDefault)
    )?.id;
    if (defaultGroup) {
      setSelectedGroup(defaultGroup);
    }
  }, [data]);

  if (isLoading) return <Spinner />;

  return (
    <>
      <Head title="Select group" />
      <Text>
        Select group which you would like to have access to your spy. Or, if you
        want to have the spy only visible to you, leave the group unselected.
      </Text>
      <Select
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value)}
      >
        <option value={undefined}>---</option>
        {data?.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </Select>
      <Button
        w="full"
        borderRadius="md"
        colorScheme="green"
        onClick={goToNextStep}
      >
        Next
      </Button>
    </>
  );
};

export default SelectGroup;
