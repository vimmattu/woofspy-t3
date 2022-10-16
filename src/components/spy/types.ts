export interface BaseProps {
  proceedSetup: () => void;
  stream?: MediaStream;
  error?: Error;
}

export interface BaseDeviceAskProps extends BaseProps {
  askForDevice: () => void;
}
