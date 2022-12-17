import { useState } from "react";
import { useMediaDevices } from "../../../hooks/devices";
import Video from "../../../components/Video";
import { BaseDeviceAskProps } from "./types";
import { Head } from "../../components/Head";
import { Button, Select, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

const CameraSelection: React.FC<BaseDeviceAskProps> = (props) => {
  const { back } = useRouter();
  const displayInfo = !props.stream && !props.error;

  return (
    <VStack my={4} spacing={2} w="full" alignItems="start">
      <Button onClick={back} variant="outline">
        Back
      </Button>
      <Head title="Select camera" />
      {displayInfo ? (
        <InitialPrompt {...props} />
      ) : (
        <CameraPreview {...props} />
      )}
    </VStack>
  );
};

const InitialPrompt: React.FC<BaseDeviceAskProps> = ({
  proceedSetup,
  askForDevice,
}) => {
  return (
    <>
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

const CameraPreview: React.FC<BaseDeviceAskProps> = ({
  stream,
  error,
  proceedSetup,
  onChangeDevice,
}) => {
  const devices = useMediaDevices();
  const [selected, setSelected] = useState<string>();

  const videoDevices = devices.filter((d) => d.kind === "videoinput");
  if (error)
    return (
      <>
        <h2 className="text-center text-xl text-red-500">Error happened :(</h2>
        <p className="text-center text-red-500">{error.message}</p>
      </>
    );

  function handleChange(id: string) {
    setSelected(id);
    onChangeDevice && onChangeDevice(id);
  }

  return (
    <>
      <Video stream={stream} />
      <Select onChange={(e) => handleChange(e.target.value)} value={selected}>
        {videoDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </Select>
      <Button w="full" colorScheme="green" onClick={proceedSetup}>
        Next
      </Button>
    </>
  );
};

export default CameraSelection;
