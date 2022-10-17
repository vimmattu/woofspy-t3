import { useCallback, useEffect, useState } from "react";
import { ActiveDevice } from "../components/spy/types";

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
  active: ActiveDevice,
  allowed: boolean,
  id?: string | null
) {
  if (!devices.filter((d) => d.kind === kind).length) return false;
  if (!allowed) return false;
  if (active === ActiveDevice.CAMERA && kind === "audioinput") return false;
  if (active === ActiveDevice.MICROPHONE && kind === "videoinput") return false;
  if (id) return { deviceId: { exact: id } };
  return true;
}

export function useMediaStream({
  cameraId,
  microphoneId,
  activeDeviceType,
}: {
  cameraId?: string | null;
  microphoneId?: string;
  activeDeviceType: ActiveDevice;
}) {
  const devices = useMediaDevices();
  const [error, setError] = useState<Error>();
  const [stream, setStream] = useState<MediaStream>();
  const [cameraInitialized, setCameraInitialized] = useState<boolean>(false);
  const [audioInitialized, setAudioInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (!devices.length) return;
    if (!cameraInitialized && !audioInitialized) return;
    if (activeDeviceType === ActiveDevice.MICROPHONE && !audioInitialized)
      return;
    if (activeDeviceType === ActiveDevice.CAMERA && !cameraInitialized) return;
    stopTracks();
    navigator.mediaDevices
      .getUserMedia({
        video: getConstraintForType(
          devices,
          "videoinput",
          activeDeviceType,
          cameraInitialized,
          cameraId
        ),
        audio: getConstraintForType(
          devices,
          "audioinput",
          activeDeviceType,
          audioInitialized,
          microphoneId
        ),
      })
      .then(setStream)
      .catch((e) => {
        const error = e as Error;
        console.error(e);
        setError(error);
      });
  }, [
    cameraId,
    microphoneId,
    devices,
    activeDeviceType,
    cameraInitialized,
    audioInitialized,
    stopTracks,
  ]);

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
        .then((stream) => {
          setStream(stream);
          if (type === "video") setCameraInitialized(true);
          else setAudioInitialized(true);
          console.log("should be set", type);
        })
        .catch((e) => {
          const error = e as Error;
          console.error(e);
          setError(error);
        });
    },
    [stream]
  );

  // Stop each track of stream on unmount
  useEffect(() => () => stream?.getTracks().forEach((t) => t.stop()), [stream]);

  return { error, stream, askForDevice, clearStream };
}
