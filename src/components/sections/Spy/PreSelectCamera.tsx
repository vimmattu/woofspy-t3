import { Head } from "../../Head";
import { Button, Text } from "@chakra-ui/react";
import { SpySetupStep, useSpySetup } from "../../../hooks/spy";

const PreSelectCamera: React.FC = () => {
  const { goToStep, goToNextStep } = useSpySetup();
  return (
    <>
      <Head title="Select camera" />
      <Text>
        Choose whether you&apos;d like to use camera or not. Camera use is{" "}
        <i>not</i> required.
      </Text>
      <Text>
        If you want to use camera, the browser will ask for permissions for
        camera usage.
      </Text>
      <Button
        w="full"
        borderRadius="md"
        colorScheme="green"
        onClick={goToNextStep}
      >
        I want to use camera
      </Button>
      <Button
        w="full"
        borderRadius="md"
        colorScheme="red"
        title="You will be redirected to select microphone"
        onClick={() => goToStep(SpySetupStep.PRE_SELECT_MICROPHONE)}
      >
        I don&apos;t want to use camera
      </Button>
    </>
  );
};

export default PreSelectCamera;
