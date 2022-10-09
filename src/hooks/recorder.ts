import { useEffect, useRef, useState } from "react";
import ActivityDetector from "../utils/activity";

export function useMediaDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(setDevices);
  }, []);

  return devices;
}

export function useMediaStream(id?: string) {
  const [stream, setStream] = useState<MediaStream>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: id ? { deviceId: { exact: id } } : true,
        audio: id ? { deviceId: { exact: id } } : true,
      })
      .then(setStream);
  }, [id]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  return stream;
}

export function useActivityRecorder(stream?: MediaStream) {
  const activity = useRef(new ActivityDetector());

  useEffect(() => {
    activity.current.on("start", () => console.log("START!"));
  }, []);

  useEffect(() => {
    stream && activity.current.setSource(stream);
  }, [stream]);
}
