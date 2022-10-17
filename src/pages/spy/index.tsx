import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
// import CameraSelection from "../../components/spy/SelectCamera";
// import SetSensitivity from "../../components/spy/SetSensitivity";
// import SpyView from "../../components/spy/SpyView";
import { ActiveDevice } from "../../components/spy/types";
import { useMediaStream } from "../../hooks/devices";
import { useCreateSession } from "../../hooks/sessions";

const CameraSelection = dynamic(
  () => import("../../components/spy/SelectCamera"),
  { ssr: false }
);
const MicrophoneSelection = dynamic(
  () => import("../../components/spy/SelectMicrophone"),
  { ssr: false }
);
const SpyView = dynamic(() => import("../../components/spy/SpyView"), {
  ssr: false,
});

enum Step {
  SELECT_CAMERA,
  SELECT_MICROPHONE,
  //SET_SENSITIVITY,
  DONE,
}

export default function SpyPage() {
  const { data, mutateAsync: createSession } = useCreateSession();
  const [step, setStep] = useState<Step>(Step.SELECT_CAMERA);
  const [cameraId, setCameraId] = useState<string | null>();
  const [microphoneId, setMicrophoneId] = useState<string>();
  const { stream, error, askForDevice, clearStream } = useMediaStream({
    cameraId,
    microphoneId,
    activeDeviceType:
      step === Step.SELECT_CAMERA
        ? ActiveDevice.CAMERA
        : step === Step.SELECT_MICROPHONE
        ? ActiveDevice.MICROPHONE
        : ActiveDevice.BOTH,
  });

  const askVideo = useCallback(() => {
    askForDevice("video");
  }, [askForDevice]);

  const askAudio = useCallback(() => {
    askForDevice("audio");
  }, [askForDevice]);

  function proceedToMicrophoneSelection() {
    clearStream();
    setStep(Step.SELECT_MICROPHONE);
  }

  async function proceedToSetSensitivity() {
    await createSession();
    setStep(Step.DONE);
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
      // case Step.SET_SENSITIVITY:
      //   return (
      //     <SetSensitivity
      //       proceedSetup={() => setStep(Step.DONE)}
      //       error={error}
      //     />
      //   );
      case Step.DONE:
        return (
          <SpyView
            stream={stream}
            error={error}
            proceedSetup={() => {}}
            sessionId={data?.id}
          />
        );
    }
  };

  return <main className="w-full px-4 md:w-1/2 xl:w-1/3 ">{renderView()}</main>;
}
