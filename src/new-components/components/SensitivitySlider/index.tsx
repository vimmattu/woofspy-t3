import {
  FormControl,
  FormLabel,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";

interface Props {
  onChangeSensitivity: (sensitivity: number) => void;
  min: number;
  max: number;
  defaultValue: number;
  step: number;
}

const SensitivitySlider = ({ onChangeSensitivity, ...props }: Props) => {
  return (
    <FormControl w="full" pb={4}>
      <FormLabel>Sensitivity</FormLabel>
      <Slider onChange={onChangeSensitivity} {...props}>
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
