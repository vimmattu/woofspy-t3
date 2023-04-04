import { useCallback, useEffect, useRef } from "react";
import { useActivityDetector } from "../../../hooks/detector";
import { useActivityRecorder } from "../../../hooks/recorder";
import { useCreateRecording } from "../../../hooks/recordings";
import Video from "../../Video";
import WaveForm from "../../WaveForm";
import { Head } from "../../Head";
import { Button, Text, ToastId, useToast } from "@chakra-ui/react";
import SensitivitySlider from "../../SensitivitySlider";
import { useLiveConnection } from "../../../hooks/connection";
import { useMediaStream } from "../../../hooks/devices";
import { useEndSession } from "../../../hooks/sessions";
import { useRouter } from "next/router";

const SpyView: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const toast = useToast();
  const loadingToastRef = useRef<ToastId>();
  const hasMounted = useRef(false);
  const { mutateAsync: endSession } = useEndSession();
  const { mutateAsync: createRecording } = useCreateRecording();
  const { stream, startStream } = useMediaStream();
  const { push: navigate } = useRouter();
  useLiveConnection({
    sessionId,
    streamToSend: stream,
  });

  useEffect(() => {
    if (!hasMounted.current) {
      startStream();
      hasMounted.current = true;
    }
  }, []);

  const onRecordingAvailable = useCallback(
    async (event: BlobEvent) => {
      if (!sessionId) return;

      if (loadingToastRef.current)
        toast.update(loadingToastRef.current, { title: "Uploading recording" });

      const { url, fields } = await createRecording({ sessionId });

      const data = {
        ...fields,
        //"Content-Type": event.data.type, // TODO: add content-type
        file: event.data,
      };

      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) => formData.append(key, val));

      await fetch(url, {
        method: "POST",
        body: formData,
      });

      toast.closeAll();

      toast({
        title: "Recording uploaded",
        status: "success",
        duration: 5000,
      });
    },
    [sessionId, createRecording]
  );

  const { start: startRecording, end: onEnd } = useActivityRecorder({
    stream,
    onFinish: onRecordingAvailable,
  });

  const onStart = useCallback(() => {
    startRecording();
    loadingToastRef.current = toast({
      title: "Detected activity",
      status: "loading",
      duration: null,
    });
  }, [startRecording]);

  const detectActive = useActivityDetector({
    onStart,
    onEnd,
  });

  const handleEndSession = async () => {
    await endSession({ sessionId });
    navigate("/history");
  };

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
      <SensitivitySlider max={2} min={1} step={0.01} />
      <Button
        w="full"
        borderRadius="md"
        colorScheme="red"
        title="You will be redirected to select microphone"
        onClick={handleEndSession}
      >
        End spy
      </Button>
    </>
  );
};

export default SpyView;
