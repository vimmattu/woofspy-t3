import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import CameraSelection from "../../components/spy/SelectCamera";
// import MicrophoneSelection from "../../components/spy/SelectMicrophone";
import SetSensitivity from "../../components/spy/SetSensitivity";
import SpyView from "../../components/spy/SpyView";
import Video from "../../components/Video";
import { useMediaDevices, useMediaStream } from "../../hooks/devices";

const MicrophoneSelection = dynamic(
  () => import("../../components/spy/SelectMicrophone"),
  { ssr: false }
);

enum Step {
  SELECT_CAMERA,
  SELECT_MICROPHONE,
  SET_SENSITIVITY,
  DONE,
}

export default function SpyPage() {
  const [step, setStep] = useState<Step>(Step.SELECT_CAMERA);
  const [cameraId, setCameraId] = useState<string | null>();
  const [microphoneId, setMicrophoneId] = useState<string>();
  const [autoUpdate, setAutoUpdate] = useState<boolean>(false);
  const { stream, error, askForDevice, clearStream } = useMediaStream({
    cameraId,
    microphoneId,
    allowAutoUpdate: autoUpdate,
  });

  console.log(step);

  const askVideo = useCallback(() => {
    askForDevice("video");
    setAutoUpdate(true);
  }, [askForDevice]);

  const askAudio = useCallback(() => {
    askForDevice("audio");
    setAutoUpdate(true);
  }, [askForDevice]);

  function proceedToMicrophoneSelection(id?: string | null) {
    clearStream();
    setCameraId(id);
    setStep(Step.SELECT_MICROPHONE);
    setAutoUpdate(false);
  }

  function proceedToSetSensitivity(id?: string | null) {
    if (!id) return;
    setMicrophoneId(id);
    setStep(Step.SET_SENSITIVITY);
  }

  const renderView = () => {
    switch (step) {
      case Step.SELECT_CAMERA:
        return (
          <CameraSelection
            stream={stream}
            proceedSetup={proceedToMicrophoneSelection}
            askForDevice={askVideo}
            error={error}
            onChangeDevice={(id) => setCameraId(id)}
          />
        );
      case Step.SELECT_MICROPHONE:
        return (
          <MicrophoneSelection
            stream={stream}
            askForDevice={askAudio}
            proceedSetup={proceedToSetSensitivity}
            onChangeDevice={(id) => setMicrophoneId(id)}
            error={error}
          />
        );
      case Step.SET_SENSITIVITY:
        return (
          <SetSensitivity
            proceedSetup={() => setStep(Step.DONE)}
            error={error}
          />
        );
      case Step.DONE:
        return <SpyView />;
    }
  };

  return <main className="w-full px-4 md:w-1/2 xl:w-1/3 ">{renderView()}</main>;
}
