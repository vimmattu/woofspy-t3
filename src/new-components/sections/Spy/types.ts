export interface BaseProps {
  proceedSetup: () => void;
  stream?: MediaStream;
  error?: Error;
  sensitivity: number;
  setSensitivity: (value: number) => void;
}

export interface BaseDeviceAskProps extends BaseProps {
  askForDevice: () => void;
  onChangeDevice?: (id?: string) => void;
}

export enum ActiveDevice {
  CAMERA,
  MICROPHONE,
  BOTH,
}
