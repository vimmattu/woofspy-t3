import { useEffect, useState } from "react";
import ActivityDetector from "../utils/activity";
import ActivityRecorder from "../utils/recorder";
import { useCreateRecording } from "./sessions";

export function useMediaDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(setDevices);
  }, []);

  return devices;
}

function getConstraintForType(
  devices: MediaDeviceInfo[],
  kind: "videoinput" | "audioinput",
  id?: string
) {
  const hasDevices = devices.filter((d) => d.kind === kind).length;
  return !hasDevices ? false : id ? { deviceId: { exact: id } } : true;
}

export function useMediaStream(id?: string) {
  const devices = useMediaDevices();
  const [stream, setStream] = useState<MediaStream>();

  useEffect(() => {
    if (!devices.length) return;
    navigator.mediaDevices
      .getUserMedia({
        video: getConstraintForType(devices, "videoinput", id),
        audio: getConstraintForType(devices, "audioinput", id) || true,
      })
      .then(setStream);
  }, [id, devices]);

  // Stop each track of stream on unmount
  useEffect(() => () => stream?.getTracks().forEach((t) => t.stop()), [stream]);

  return stream;
}

export enum DetectorState {
  IDLE,
  RECORDING,
  PROCESSING,
}

export function useActivityRecorder(sessionId: string, stream?: MediaStream) {
  const { mutate: createRecording } = useCreateRecording();
  const [detectorState, setDetectorState] = useState<DetectorState>(
    DetectorState.IDLE
  );
  const [recorder] = useState(new ActivityRecorder());
  const [activityDetector, setActivityDetector] = useState<ActivityDetector>();

  useEffect(() => {
    const listener = (event: BlobEvent) => {
      const url = URL.createObjectURL(event.data);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style.display = "none";
      a.href = url;
      a.download = "test.webm";
      a.click();
      URL.revokeObjectURL(url);
      setDetectorState(DetectorState.IDLE);
      createRecording({ sessionId });
    };
    recorder.on("recording-available", listener);
    return () => {
      recorder.off("recording-available", listener);
    };
  }, [recorder, sessionId, createRecording]);

  useEffect(() => {
    const startListener = () => {
      setDetectorState(DetectorState.RECORDING);
      recorder.start();
    };
    const stopListener = () => {
      setDetectorState(DetectorState.PROCESSING);
      recorder.stop();
    };
    activityDetector?.on("start", startListener);
    activityDetector?.on("stop", stopListener);
    return () => {
      activityDetector?.off("start", startListener);
      activityDetector?.off("stop", stopListener);
    };
  }, [activityDetector, recorder]);

  useEffect(() => {
    if (!stream || !activityDetector) return;
    activityDetector.setSource(stream);
    recorder.setSource(stream);
  }, [stream, activityDetector, recorder]);

  function start() {
    setActivityDetector(new ActivityDetector());
  }

  return {
    detectorStarted: !!activityDetector,
    startDetector: start,
    detectorState,
  };
}
