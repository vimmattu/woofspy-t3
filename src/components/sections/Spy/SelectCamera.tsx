import { useState } from "react";
import { useMediaDevices } from "../../../hooks/devices";
import Video from "../../Video";
import { BaseDeviceAskProps } from "./types";
import { Head } from "../../Head";
import { Button, Select } from "@chakra-ui/react";

const SelectCamera: React.FC<BaseDeviceAskProps> = ({
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
        <Head title="Select camera" />
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
      <Head title="Select camera" />
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

export default SelectCamera;
