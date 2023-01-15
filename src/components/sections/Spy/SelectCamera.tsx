import {
  useCameraId,
  useDeviceError,
  useMediaDevices,
  useStream,
} from "../../../hooks/devices";
import Video from "../../Video";
import { Head } from "../../Head";
import { Button, Select } from "@chakra-ui/react";
import { useSpySetup } from "../../../hooks/spy";

const SelectCamera: React.FC = () => {
  const devices = useMediaDevices();
  const [selected, setSelected] = useCameraId();
  const [stream] = useStream();
  const [error] = useDeviceError();
  const { goToNextStep } = useSpySetup();

  const videoDevices = devices.filter((d) => d.kind === "videoinput");
  if (error)
    return (
      <>
        <Head title="Select camera" />
        <h2 className="text-center text-xl text-red-500">Error happened :(</h2>
        <p className="text-center text-red-500">{error.message}</p>
      </>
    );

  return (
    <>
      <Head title="Select camera" />
      <Video stream={stream} />
      <Select
        onChange={(e) => setSelected(e.target.value)}
        value={selected ?? undefined}
      >
        {videoDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </Select>
      <Button w="full" colorScheme="green" onClick={goToNextStep}>
        Next
      </Button>
    </>
  );
};

export default SelectCamera;
