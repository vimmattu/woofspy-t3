import { useState } from "react";
import { useActivityDetector } from "../../../hooks/detector";
import { useMediaDevices } from "../../../hooks/devices";
import WaveForm from "../../../components/WaveForm";
import { BaseDeviceAskProps } from "./types";
import { Button, Select, Text } from "@chakra-ui/react";
import { Head } from "../../components/Head";
import SensitivitySlider from "../../components/SensitivitySlider";

const SelectMicrophone: React.FC<BaseDeviceAskProps> = ({
  stream,
  error,
  proceedSetup,
  onChangeDevice,
  sensitivity,
  setSensitivity,
}) => {
  const devices = useMediaDevices();
  const [selected, setSelected] = useState<string>();

  const detectActive = useActivityDetector({
    stream,
    sensitivity,
  });

  const audioDevices = devices.filter((d) => d.kind === "audioinput");
  if (error)
    return (
      <>
        <Head title="Select microphone" />
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
      <Head title="Select microphone" />
      <WaveForm stream={stream} />
      <Text>{detectActive ? "Detecting activity" : "Idle"}</Text>
      <Select onChange={(e) => handleChange(e.target.value)} value={selected}>
        {audioDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </Select>
      <SensitivitySlider
        onChangeSensitivity={setSensitivity}
        max={2}
        min={1}
        step={0.01}
        defaultValue={sensitivity}
      />
      <Button w="full" colorScheme="green" onClick={proceedSetup}>
        Start spy
      </Button>
    </>
  );
};

export default SelectMicrophone;
