import { useActivityDetector } from "../../../hooks/detector";
import {
  useDeviceError,
  useMediaDevices,
  useMicrophoneId,
  useStream,
} from "../../../hooks/devices";
import WaveForm from "../../../components/WaveForm";
import { Button, Select, Text } from "@chakra-ui/react";
import { Head } from "../../Head";
import SensitivitySlider from "../../SensitivitySlider";
import { useCreateSession } from "../../../hooks/sessions";
import { useRouter } from "next/router";
import { useSelectedGroup, useSpyMode, useSpySetup } from "../../../hooks/spy";

const SelectMicrophone: React.FC = () => {
  const [, setIsHost] = useSpyMode();
  const { goToNextStep } = useSpySetup();
  const devices = useMediaDevices();
  const [selected, setSelected] = useMicrophoneId();
  const [stream] = useStream();
  const [error] = useDeviceError();
  const detectActive = useActivityDetector({});
  const { mutateAsync: createSession } = useCreateSession();
  const { push: navigate } = useRouter();
  const [groupId] = useSelectedGroup();

  const handleStart = async () => {
    const session = await createSession({ groupId });
    setIsHost(true);
    goToNextStep();
    navigate(`/spy/${session.id}`);
  };

  const audioDevices = devices.filter((d) => d.kind === "audioinput");
  if (error)
    return (
      <>
        <Head title="Select microphone" />
        <h2 className="text-center text-xl text-red-500">Error happened :(</h2>
        <p className="text-center text-red-500">{error.message}</p>
      </>
    );

  return (
    <>
      <Head title="Select microphone" />
      <WaveForm stream={stream} />
      <Text>{detectActive ? "Detecting activity" : "Idle"}</Text>
      <Select onChange={(e) => setSelected(e.target.value)} value={selected}>
        {audioDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </Select>
      <SensitivitySlider max={2} min={1} step={0.01} />
      <Button w="full" colorScheme="green" onClick={handleStart}>
        Start spy
      </Button>
    </>
  );
};

export default SelectMicrophone;
