import { atom, useAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useMediaStream } from "./devices";

const isHostAtom = atom(false);
export const useSpyMode = () => useAtom(isHostAtom);

export enum SpySetupStep {
  SELECT_GROUP,
  PRE_SELECT_CAMERA,
  SELECT_CAMERA,
  PRE_SELECT_MICROPHONE,
  SELECT_MICROPHONE,
  DONE,
}
const stepAtom = atom(SpySetupStep.SELECT_GROUP);
export const useSpySetupStep = () => useAtom(stepAtom);

const selectedGroupAtom = atom<string | undefined>(undefined);
export const useSelectedGroup = () => useAtom(selectedGroupAtom);

export const useSpySetup = () => {
  const [step, setStep] = useSpySetupStep();
  const { back } = useRouter();
  const { setupDevice } = useMediaStream();

  const goToStep = useCallback((step: SpySetupStep) => {
    switch (step) {
      case SpySetupStep.SELECT_CAMERA:
        setStep(step);
        setupDevice("video");
        break;
      case SpySetupStep.SELECT_MICROPHONE:
        setStep(step);
        setupDevice("audio");
        break;
      case SpySetupStep.PRE_SELECT_CAMERA:
        setStep(step);
        break;
      case SpySetupStep.PRE_SELECT_MICROPHONE:
        setStep(step);
        break;
      case SpySetupStep.DONE:
        setStep(step);
        break;
      default:
        break;
    }
  }, []);

  const goToPreviousStep = useCallback(() => {
    if (step === 0) return back();
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
