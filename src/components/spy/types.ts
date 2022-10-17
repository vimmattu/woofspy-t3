export interface BaseProps {
  proceedSetup: (id?: string | null) => void;
  stream?: MediaStream;
  error?: Error;
}

export interface BaseDeviceAskProps extends BaseProps {
  askForDevice: () => void;
}
