import { useState } from "react";
import { useActivityDetector } from "../../../hooks/detector";
import { useMediaDevices } from "../../../hooks/devices";
import WaveForm from "../../../components/WaveForm";
import { BaseDeviceAskProps } from "./types";
import {
  Button,
  FormControl,
  FormLabel,
  Select,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import { Head } from "../../components/Head";

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
      <FormControl w="full" pb={4}>
        <FormLabel>Sensitivity</FormLabel>
        <Slider onChange={(e) => setSensitivity(e)} max={2} min={1} step={0.01}>
          <SliderMark mt={2} ml={-2.5} value={1.1}>
            High sensitivity
          </SliderMark>
          <SliderMark mt={2} ml={-2.5} value={1.9}>
            Low sensitivity
          </SliderMark>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>

          <SliderThumb />
        </Slider>
      </FormControl>
      <Button w="full" colorScheme="green" onClick={proceedSetup}>
        Start spy
      </Button>
    </>
  );
};

export default SelectMicrophone;
