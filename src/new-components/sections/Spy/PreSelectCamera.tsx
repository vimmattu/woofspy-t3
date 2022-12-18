import { BaseDeviceAskProps } from "./types";
import { Head } from "../../components/Head";
import { Button, Text } from "@chakra-ui/react";

const PreSelectCamera: React.FC<BaseDeviceAskProps> = ({
  proceedSetup,
  askForDevice,
}) => {
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
        onClick={() => askForDevice()}
      >
        I want to use camera
      </Button>
      <Button
        w="full"
        borderRadius="md"
        colorScheme="red"
        title="You will be redirected to select microphone"
        onClick={() => proceedSetup()}
      >
        I don&apos;t want to use camera
      </Button>
    </>
  );
};

export default PreSelectCamera;
