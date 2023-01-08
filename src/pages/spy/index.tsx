import { Button, Spinner, VStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActiveDevice } from "../../components/sections/Spy/types";
import { useMediaStream } from "../../hooks/devices";
import {
  useActiveSession,
  useCreateSession,
  useEndSession,
} from "../../hooks/sessions";

const PreSelectCamera = dynamic(
  () => import("../../components/sections/Spy/PreSelectCamera"),
  { ssr: false }
);
const PreSelectMicrophone = dynamic(
  () => import("../../components/sections/Spy/PreSelectMicrophone"),
  { ssr: false }
);
const SelectCamera = dynamic(
  () => import("../../components/sections/Spy/SelectCamera"),
  { ssr: false }
);
const SelectMicrophone = dynamic(
  () => import("../../components/sections/Spy/SelectMicrophone"),
  { ssr: false }
);
const SpyView = dynamic(() => import("../../components/sections/Spy/SpyView"), {
  ssr: false,
});
const GuestView = dynamic(
  () => import("../../components/sections/Spy/GuestView"),
  {
    ssr: false,
  }
);

enum Step {
  PRE_SELECT_CAMERA,
  SELECT_CAMERA,
  PRE_SELECT_MICROPHONE,
  SELECT_MICROPHONE,
  DONE,
  SPY,
}

function getActiveDeviceType(step: Step) {
  if ([Step.PRE_SELECT_CAMERA, Step.SELECT_CAMERA].includes(step))
    return ActiveDevice.CAMERA;
  if ([Step.PRE_SELECT_MICROPHONE, Step.SELECT_MICROPHONE].includes(step))
    return ActiveDevice.MICROPHONE;
  return ActiveDevice.BOTH;
}

export default function SpyPage() {
  const alreadyEndedSession = useRef(false);
  const { data: activeSession, isLoading: guestLoading } =
    useActiveSession(false);
  const {
    data,
    mutateAsync: createSession,
    isLoading: hostLoading,
  } = useCreateSession();
  const { mutateAsync: endSession } = useEndSession();
  const [step, setStep] = useState<Step>(Step.PRE_SELECT_CAMERA);
  const [cameraId, setCameraId] = useState<string | null>();
  const [microphoneId, setMicrophoneId] = useState<string>();
  const [sensitivity, setSensitivity] = useState<number>(1.5);
  const { stream, error, askForDevice, clearStream } = useMediaStream({
    cameraId,
    microphoneId,
    activeDeviceType: getActiveDeviceType(step),
  });
  const { back, push: navigate } = useRouter();

  const askVideo = useCallback(() => {
    setStep(Step.SELECT_CAMERA);
    askForDevice("video");
  }, [askForDevice]);

  const askAudio = useCallback(() => {
    setStep(Step.SELECT_MICROPHONE);
    askForDevice("audio");
  }, [askForDevice]);

  function proceedToMicrophoneSelection() {
    clearStream();
    setStep(Step.PRE_SELECT_MICROPHONE);
  }

  async function proceedToSetSensitivity() {
    await createSession();
    setStep(Step.DONE);
  }

  async function triggerEndSession() {
    if (!data) return;
    await endSession({ sessionId: data.id });
    alreadyEndedSession.current = true;
    navigate("/history");
  }

  function navigateBack() {
    if (step === Step.SPY) return back();
    if (step === Step.DONE) return back();
    if (step < 1) return back();
    setStep(step - 1);
  }

  useEffect(() => {
    if (!!activeSession) {
      setStep(Step.SPY);
    }
  }, [activeSession]);

  useEffect(() => {
    if (step !== Step.DONE) return;
    if (!data?.id) return;
    const sendBeacon = () =>
      navigator.sendBeacon(`/api/sessions/${data.id}/exit`);
    document.addEventListener("visibilitychange", sendBeacon);
    return () => {
      document.removeEventListener("visibilitychange", sendBeacon);
      if (!alreadyEndedSession.current) endSession({ sessionId: data.id });
    };
  }, [step]);

  if (guestLoading || hostLoading) return <Spinner />;

  const renderView = () => {
    switch (step) {
      case Step.PRE_SELECT_CAMERA:
        return (
          <PreSelectCamera
            stream={stream}
            proceedSetup={proceedToMicrophoneSelection}
            askForDevice={askVideo}
            error={error}
            onChangeDevice={(id) => setCameraId(id)}
            sensitivity={sensitivity}
            setSensitivity={setSensitivity}
          />
        );
      case Step.SELECT_CAMERA:
        return (
          <SelectCamera
            stream={stream}
            proceedSetup={proceedToMicrophoneSelection}
            askForDevice={askVideo}
            error={error}
            onChangeDevice={(id) => setCameraId(id)}
            sensitivity={sensitivity}
            setSensitivity={setSensitivity}
          />
        );
      case Step.PRE_SELECT_MICROPHONE:
        return (
          <PreSelectMicrophone
            stream={stream}
            askForDevice={askAudio}
            proceedSetup={proceedToSetSensitivity}
            onChangeDevice={(id) => setMicrophoneId(id)}
            error={error}
            sensitivity={sensitivity}
            setSensitivity={setSensitivity}
          />
        );
      case Step.SELECT_MICROPHONE:
        return (
          <SelectMicrophone
            stream={stream}
            askForDevice={askAudio}
            proceedSetup={proceedToSetSensitivity}
            onChangeDevice={(id) => setMicrophoneId(id)}
            error={error}
            sensitivity={sensitivity}
            setSensitivity={setSensitivity}
          />
        );
      case Step.DONE:
        return (
          <SpyView
            stream={stream}
            error={error}
            proceedSetup={triggerEndSession}
            sessionId={data?.id}
            sensitivity={sensitivity}
            setSensitivity={setSensitivity}
          />
        );
      case Step.SPY:
        return <GuestView sessionId={activeSession?.id} />;
    }
  };

  return (
    <VStack my={4} spacing={2} w="full" alignItems="start">
      <Button onClick={navigateBack} variant="outline">
        Back
      </Button>
      {renderView()}
    </VStack>
  );
}
