export interface BaseProps {
  proceedSetup: (id?: string | null) => void;
  stream?: MediaStream;
  error?: Error;
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
