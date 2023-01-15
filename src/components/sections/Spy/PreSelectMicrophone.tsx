import { Head } from "../../Head";
import { Button, Text } from "@chakra-ui/react";
import { useSpySetup } from "../../../hooks/spy";

const PreSelectMicrophone: React.FC = () => {
  const { goToNextStep } = useSpySetup();
  return (
    <>
      <Head title="Select microphone" />
      <Text>
        Next step is to select microphone you&apos;d like to use. Microphone use
        is <i>required</i> for woofspy to work.
      </Text>
      <Text>The browser will ask for permissions for microphone usage.</Text>
      <Button
        w="full"
        borderRadius="md"
        colorScheme="green"
        onClick={goToNextStep}
      >
        Select microphone
      </Button>
    </>
  );
};

export default PreSelectMicrophone;
