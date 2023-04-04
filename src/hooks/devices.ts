import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { ActiveDevice } from "../components/sections/Spy/types";
import { SpySetupStep, useSpySetupStep } from "./spy";

const devicesAtom = atom<MediaDeviceInfo[]>([]);
const cameraInitialized = atom<boolean>(false);
const microphoneInitialized = atom<boolean>(false);
const cameraIdAtom = atom<string | null | undefined>(undefined);
const microphoneIdAtom = atom<string | undefined>(undefined);
const errorAtom = atom<Error | undefined>(undefined);
const streamAtom = atom<MediaStream | undefined>(undefined);

export const useDeviceList = () => useAtom(devicesAtom);
export const useCameraInitialized = () => useAtom(cameraInitialized);
export const useMicrophoneInitialized = () => useAtom(microphoneInitialized);
export const useCameraId = () => useAtom(cameraIdAtom);
export const useMicrophoneId = () => useAtom(microphoneIdAtom);
export const useDeviceError = () => useAtom(errorAtom);
export const useStream = () => useAtom(streamAtom);

export function useMediaDevices() {
  const [devices, setDevices] = useDeviceList();

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(setDevices);
  }, []);

  return devices;
}

function getConstraintForType(
  devices: MediaDeviceInfo[],
  kind: "videoinput" | "audioinput",
  allowed: boolean,
  id?: string | null
) {
  if (!devices.filter((d) => d.kind === kind).length) return false;
  if (!allowed) return false;
  if (id) return { deviceId: { exact: id } };
  return true;
}

export function useMediaStream() {
  const f = useRef(false);
  const devices = useMediaDevices();
  const [error, setError] = useDeviceError();
  const [stream, setStream] = useStream();
  const [cameraId] = useCameraId();
  const [microphoneId] = useMicrophoneId();
  const [cameraInitialized, setCameraInitialized] = useCameraInitialized();
  const [audioInitialized, setAudioInitialized] = useMicrophoneInitialized();
  const [step] = useSpySetupStep();

  const activeDeviceType = useMemo(() => {
    if (step <= SpySetupStep.SELECT_CAMERA) return ActiveDevice.CAMERA;
    if (step <= SpySetupStep.SELECT_MICROPHONE) return ActiveDevice.MICROPHONE;
    return ActiveDevice.BOTH;
  }, [step]);

  const startStream = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    navigator.mediaDevices
      .getUserMedia({
        video: getConstraintForType(
          devices,
          "videoinput",
          cameraInitialized,
          cameraId
        ),
        audio: getConstraintForType(
          devices,
          "audioinput",
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
  ]);

  const clearStream = useCallback(
    (startAfter?: boolean) => {
      setStream((stream) => {
        stream?.getTracks().forEach((t) => t.stop());
        f.current = startAfter ?? false;
        return undefined;
      });
    },
    [stream]
  );

  const askForDevice = useCallback(
    (type: "video" | "audio") => {
      if (stream) return;
      navigator.mediaDevices
        .getUserMedia(type === "video" ? { video: true } : { audio: true })
        .then((stream) => {
          setStream(stream);
          if (type === "video") setCameraInitialized(true);
          else setAudioInitialized(true);
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

  return { error, stream, askForDevice, clearStream, startStream };
}
