import { useEffect } from "react";
import { BaseDeviceAskProps, BaseProps } from "./types";

const MicrophoneSelection: React.FC<BaseDeviceAskProps> = ({
  proceedSetup,
  askForDevice,
}) => {
  useEffect(() => {
    askForDevice();
  }, [askForDevice]);
  return (
    <div>
      <p>Microphone selection</p>
      <button onClick={proceedSetup}>Next</button>
    </div>
  );
};

export default MicrophoneSelection;
