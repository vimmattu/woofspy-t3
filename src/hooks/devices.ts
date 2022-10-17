import { useCallback, useEffect, useState } from "react";

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
  id?: string | null
) {
  const hasDevices = devices.filter((d) => d.kind === kind).length;
  return !hasDevices || id === null
    ? false
    : id
    ? { deviceId: { exact: id } }
    : true;
}

export function useMediaStream({
  cameraId,
  microphoneId,
  allowAutoUpdate,
}: {
  cameraId?: string | null;
  microphoneId?: string;
  allowAutoUpdate?: boolean;
}) {
  const devices = useMediaDevices();
  const [error, setError] = useState<Error>();
  const [stream, setStream] = useState<MediaStream>();

  useEffect(() => {
    if (!devices.length) return;
    if (allowAutoUpdate === false) return;
    stopTracks();
    navigator.mediaDevices
      .getUserMedia({
        video: getConstraintForType(devices, "videoinput", cameraId),
        audio:
          getConstraintForType(devices, "audioinput", microphoneId) || true,
      })
      .then(setStream)
      .catch((e) => {
        const error = e as Error;
        setError(error);
      });
  }, [cameraId, microphoneId, devices, allowAutoUpdate]);

  const stopTracks = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
  }, [stream]);

  const clearStream = () => {
    stopTracks();
    setStream(undefined);
  };

  const askForDevice = useCallback(
    (type: "video" | "audio") => {
      if (stream) return;
      navigator.mediaDevices
        .getUserMedia(type === "video" ? { video: true } : { audio: true })
        .then(setStream)
        .catch((e) => {
          const error = e as Error;
          setError(error);
        });
    },
    [stream]
  );

  // Stop each track of stream on unmount
  useEffect(() => () => stream?.getTracks().forEach((t) => t.stop()), [stream]);

  return { error, stream, askForDevice, clearStream };
}
