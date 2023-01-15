import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { useMediaStream } from "./devices";

const isHostAtom = atom(false);
export const useSpyMode = () => useAtom(isHostAtom);

export enum SpySetupStep {
  PRE_SELECT_CAMERA,
  SELECT_CAMERA,
  PRE_SELECT_MICROPHONE,
  SELECT_MICROPHONE,
  DONE,
}
const stepAtom = atom(SpySetupStep.PRE_SELECT_CAMERA);
export const useSpySetupStep = () => useAtom(stepAtom);

export const useSpySetup = () => {
  const [step, setStep] = useSpySetupStep();
  const { askForDevice, clearStream } = useMediaStream();

  const goToStep = useCallback((step: SpySetupStep) => {
    switch (step) {
      case SpySetupStep.SELECT_CAMERA:
        setStep(step);
        askForDevice("video");
        break;
      case SpySetupStep.SELECT_MICROPHONE:
        setStep(step);
        askForDevice("audio");
        break;
      case SpySetupStep.PRE_SELECT_MICROPHONE:
        clearStream();
        setStep(step);
        break;
      case SpySetupStep.DONE:
        clearStream(true);
        setStep(step);
        break;
      default:
        break;
    }
  }, []);

  const goToPreviousStep = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const goToNextStep = useCallback(() => {
    goToStep(step + 1);
  }, [step]);

  return {
    step,
    goToStep,
    goToNextStep,
    goToPreviousStep,
  };
};
