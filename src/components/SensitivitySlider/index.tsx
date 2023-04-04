import {
  FormControl,
  FormLabel,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { useSensitivity, useSensitivityEditable } from "../../hooks/detector";

interface Props {
  min: number;
  max: number;
  step: number;
}

const SensitivitySlider = ({ ...props }: Props) => {
  const [sensitivity, setSensitivity] = useSensitivity();
  const [canEdit] = useSensitivityEditable();
  return (
    <FormControl w="full" pb={4}>
      <FormLabel>Sensitivity</FormLabel>
      <Slider
        isDisabled={!canEdit}
        {...props}
        onChange={canEdit ? setSensitivity : undefined}
        value={sensitivity}
      >
        <SliderMark mt={2} ml={-2.5} value={1.1}>
          High sensitivity
        </SliderMark>
        <SliderMark mt={2} ml={-2.5} value={1.9}>
          Low sensitivity
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>

        <SliderThumb />
      </Slider>
    </FormControl>
  );
};

export default SensitivitySlider;
