import { useCallback } from "react";
import { useActivityDetector } from "../../../hooks/detector";
import { useActivityRecorder } from "../../../hooks/recorder";
import { useCreateRecording } from "../../../hooks/sessions";
import Video from "../../../components/Video";
import WaveForm from "../../../components/WaveForm";
import { BaseProps } from "./types";
import { Head } from "../../components/Head";
import { Button, Text } from "@chakra-ui/react";
import SensitivitySlider from "../../components/SensitivitySlider";

const SpyView: React.FC<BaseProps & { sessionId?: string }> = ({
  stream,
  proceedSetup,
  sessionId,
  sensitivity,
  setSensitivity,
}) => {
  const { mutateAsync: createRecording } = useCreateRecording();

  const onRecordingAvailable = useCallback(
    async (event: BlobEvent) => {
      if (!sessionId) return;

      const { url, fields } = await createRecording({ sessionId });

      const data = {
        ...fields,
        //"Content-Type": event.data.type, // TODO: add content-type
        file: event.data,
      };

      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) => formData.append(key, val));

      fetch(url, {
        method: "POST",
        body: formData,
      });
    },
    [sessionId, createRecording]
  );

  const { start: onStart, end: onEnd } = useActivityRecorder({
    stream,
    onFinish: onRecordingAvailable,
  });

  const detectActive = useActivityDetector({
    stream,
    onStart,
    onEnd,
    sensitivity,
  });

  const hasVideoTracks = !!stream?.getTracks().filter((d) => d.kind === "video")
    .length;
  return (
    <>
      <Head title="Spy" />
      {hasVideoTracks && <Video stream={stream} />}
      <WaveForm stream={stream} />
      <Text>
        Status: {detectActive ? "Recording activity" : "Listening for activity"}
      </Text>
      <SensitivitySlider
        onChangeSensitivity={setSensitivity}
        max={2}
        min={1}
        step={0.01}
        defaultValue={sensitivity}
      />
      <Button
        w="full"
        borderRadius="md"
        colorScheme="red"
        title="You will be redirected to select microphone"
        onClick={() => proceedSetup()}
      >
        End spy
      </Button>
    </>
  );
};

export default SpyView;
