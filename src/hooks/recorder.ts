import { useEffect, useRef, useState } from "react";
import ActivityDetector from "../utils/activity";

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

export function useActivityRecorder(
  stream?: MediaStream
): [boolean, () => void] {
  const [activityDetector, setActivityDetector] = useState<ActivityDetector>();

  useEffect(() => {
    const startListener = () => console.log("start");
    const stopListener = () => console.log("stop");
    activityDetector?.on("start", startListener);
    activityDetector?.on("stop", stopListener);
    return () => {
      activityDetector?.off("start", stopListener);
    };
  }, [activityDetector]);

  useEffect(() => {
    stream && activityDetector && activityDetector.setSource(stream);
  }, [stream, activityDetector]);

  function start() {
    setActivityDetector(new ActivityDetector());
  }

  return [!!activityDetector, start];
}
