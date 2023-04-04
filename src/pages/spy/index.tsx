import { Button, Spinner } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { MainContentContainer } from "../../components/MainContentContainer";
import { SpySetupStep, useSpySetup } from "../../hooks/spy";

const SelectGroup = dynamic(
  () => import("../../components/sections/Spy/SelectGroup"),
  { ssr: false }
);
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

export default function SpyPage() {
  const { step, goToPreviousStep } = useSpySetup();

  const renderView = () => {
    switch (step) {
      case SpySetupStep.SELECT_GROUP:
        return <SelectGroup />;
      case SpySetupStep.PRE_SELECT_CAMERA:
        return <PreSelectCamera />;
      case SpySetupStep.SELECT_CAMERA:
        return <SelectCamera />;
      case SpySetupStep.PRE_SELECT_MICROPHONE:
        return <PreSelectMicrophone />;
      case SpySetupStep.SELECT_MICROPHONE:
        return <SelectMicrophone />;
      default:
        return <Spinner />;
    }
  };

  return (
    <MainContentContainer variant="spy">
      <Button onClick={goToPreviousStep} variant="outline">
        Back
      </Button>
      {renderView()}
    </MainContentContainer>
  );
}
