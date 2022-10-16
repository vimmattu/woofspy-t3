import { useCallback, useState } from "react";
import CameraSelection from "../../components/spy/SelectCamera";
import MicrophoneSelection from "../../components/spy/SelectMicrophone";
import SetSensitivity from "../../components/spy/SetSensitivity";
import SpyView from "../../components/spy/SpyView";
import Video from "../../components/Video";
import { useMediaDevices, useMediaStream } from "../../hooks/devices";

enum Step {
  SELECT_CAMERA,
  SELECT_MICROPHONE,
  SET_SENSITIVITY,
  DONE,
}

export default function SpyPage() {
  const [step, setStep] = useState<Step>(Step.SELECT_CAMERA);
  const [cameraId, setCameraId] = useState<string>();
  const [microphoneId, setMicrophoneId] = useState<string>();
  const { stream, error, askForDevice } = useMediaStream({
    cameraId,
    microphoneId,
  });

  const askVideo = useCallback(() => askForDevice("video"), [askForDevice]);
  const askAudio = useCallback(() => askForDevice("audio"), [askForDevice]);

  const renderView = () => {
    switch (step) {
      case Step.SELECT_CAMERA:
        return (
          <CameraSelection
            stream={stream}
            proceedSetup={() => setStep(Step.SELECT_MICROPHONE)}
            askForDevice={askVideo}
            error={error}
          />
        );
      case Step.SELECT_MICROPHONE:
        return (
          <MicrophoneSelection
            stream={stream}
            askForDevice={() => askForDevice("audio")}
            proceedSetup={askAudio}
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
