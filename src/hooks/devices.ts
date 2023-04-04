import { atom, useAtom } from "jotai";
import { useEffect } from "react";
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
  const [stream] = useStream();
  const [devices, setDevices] = useDeviceList();

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(setDevices);
  }, [stream]);

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
  const [cameraInitialized, setCameraInitialized] = useCameraInitialized();
  const [microphoneInitialized, setMicrophoneInitialized] =
    useMicrophoneInitialized();
  const [cameraId] = useCameraId();
  const [microphoneId] = useMicrophoneId();
  const [step] = useSpySetupStep();
  const [stream, setStream] = useStream();
  const [error, setError] = useDeviceError();

  function stopStream() {
    stream && stream.getTracks().forEach((t) => t.stop());
  }

  function setDeviceInitialized(kind: "video" | "audio", flag = true) {
    if (kind === "video") setCameraInitialized(flag);
    else if (kind === "audio") setMicrophoneInitialized(flag);
  }

  function setupDevice(kind: "video" | "audio") {
    stopStream();
    navigator.mediaDevices
      .getUserMedia({ [kind]: true })
      .then((stream) => {
        setStream(stream);
        setDeviceInitialized(kind);
      })
      .catch((err) => {
        setDeviceInitialized(kind, false);
        setError(err);
      });
  }

  useEffect(() => {
    stopStream();
    if (step === SpySetupStep.SELECT_CAMERA && cameraInitialized)
      navigator.mediaDevices
        .getUserMedia({
          video: cameraId ? { deviceId: cameraId } : true,
        })
        .then(setStream);
    else if (step === SpySetupStep.SELECT_MICROPHONE && microphoneInitialized)
      navigator.mediaDevices
        .getUserMedia({
          audio: microphoneId ? { deviceId: microphoneId } : true,
        })
        .then(setStream);
    else if (step === SpySetupStep.DONE) {
      const constraints: MediaStreamConstraints = {
        audio: microphoneId ? { deviceId: microphoneId } : true,
      };
      if (cameraInitialized)
        constraints.video = cameraId ? { deviceId: cameraId } : true;
      navigator.mediaDevices.getUserMedia(constraints).then(setStream);
    }
  }, [step, cameraId, microphoneId]);

  useEffect(() => {
    return () => stopStream();
  }, [stream]);

  return {
    stopStream,
    setupDevice,
    error,
  };
}

// export function useMediaStream() {
//   const f = useRef(false);
//   const devices = useMediaDevices();
//   const [error, setError] = useDeviceError();
//   const [stream, setStream] = useStream();
//   const [cameraId] = useCameraId();
//   const [microphoneId] = useMicrophoneId();
//   const [cameraInitialized, setCameraInitialized] = useCameraInitialized();
//   const [audioInitialized, setAudioInitialized] = useMicrophoneInitialized();
//   const [step] = useSpySetupStep();
//
//   const activeDeviceType = useMemo(() => {
//     if (step <= SpySetupStep.SELECT_CAMERA) return ActiveDevice.CAMERA;
//     if (step <= SpySetupStep.SELECT_MICROPHONE) return ActiveDevice.MICROPHONE;
//     return ActiveDevice.BOTH;
//   }, [step]);
//
//   const startStream = useCallback(() => {
//     stream?.getTracks().forEach((t) => t.stop());
//     navigator.mediaDevices
//       .getUserMedia({
//         video: getConstraintForType(
//           devices,
//           "videoinput",
//           cameraInitialized,
//           cameraId
//         ),
//         audio: getConstraintForType(
//           devices,
//           "audioinput",
//           audioInitialized,
//           microphoneId
//         ),
//       })
//       .then(setStream)
//       .catch((e) => {
//         const error = e as Error;
//         console.error(e);
//         setError(error);
//       });
//   }, [
//     cameraId,
//     microphoneId,
//     devices,
//     activeDeviceType,
//     cameraInitialized,
//     audioInitialized,
//   ]);
//
//   const clearStream = useCallback(
//     (startAfter?: boolean) => {
//       setStream((stream) => {
//         stream?.getTracks().forEach((t) => t.stop());
//         f.current = startAfter ?? false;
//         return undefined;
//       });
//     },
//     [stream]
//   );
//
//   const askForDevice = useCallback(
//     (type: "video" | "audio") => {
//       if (stream) return;
//       navigator.mediaDevices
//         .getUserMedia(type === "video" ? { video: true } : { audio: true })
//         .then((stream) => {
//           setStream(stream);
//           if (type === "video") setCameraInitialized(true);
//           else setAudioInitialized(true);
//         })
//         .catch((e) => {
//           const error = e as Error;
//           console.error(e);
//           setError(error);
//         });
//     },
//     [stream]
//   );
//
//   // Stop each track of stream on unmount
//   useEffect(() => () => stream?.getTracks().forEach((t) => t.stop()), [stream]);
//
//   return { error, stream, askForDevice, clearStream, startStream };
// }
