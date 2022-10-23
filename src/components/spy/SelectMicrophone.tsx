import { useState } from "react";
import Head from "next/head";
import { useActivityDetector } from "../../hooks/detector";
import { useMediaDevices } from "../../hooks/devices";
import WaveForm from "../WaveForm";
import { BaseDeviceAskProps } from "./types";

const MicrophoneSelection: React.FC<BaseDeviceAskProps> = (props) => {
  const displayInfo = !props.stream && !props.error;

  return (
    <>
      <Head>
        <title>Microphone selection</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="mb-2 text-center text-2xl">Microphone selection</h1>
      {displayInfo ? (
        <InitialPrompt {...props} />
      ) : (
        <MicrophonePreview {...props} />
      )}
    </>
  );
};

const InitialPrompt: React.FC<BaseDeviceAskProps> = ({ askForDevice }) => {
  return (
    <>
      <p className="mb-2">
        Next step is to select microphone you&apos;d like to use. Microphone use
        is <i>required</i> for woofspy to work.
      </p>
      <p className="mb-2">
        The browser will ask for permissions for microphone usage.
      </p>
      <button
        className="mb-2 w-full rounded bg-blue-500 p-2 text-white"
        onClick={() => askForDevice()}
      >
        Select microphone
      </button>
    </>
  );
};

const MicrophonePreview: React.FC<BaseDeviceAskProps> = ({
  stream,
  error,
  proceedSetup,
  onChangeDevice,
  sensitivity,
  setSensitivity,
}) => {
  const devices = useMediaDevices();
  const [selected, setSelected] = useState<string>();

  const detectActive = useActivityDetector({
    stream,
    sensitivity,
  });

  const videoDevices = devices.filter((d) => d.kind === "audioinput");
  if (error)
    return (
      <>
        <h2 className="text-center text-xl text-red-500">Error happened :(</h2>
        <p className="text-center text-red-500">{error.message}</p>
      </>
    );

  function handleChange(id: string) {
    setSelected(id);
    onChangeDevice && onChangeDevice(id);
  }

  return (
    <>
      <WaveForm stream={stream} />
      <p>{detectActive ? "Detecting activity" : "Idle"}</p>
      <select
        onChange={(e) => handleChange(e.target.value)}
        value={selected}
        className="my-2 w-full rounded-sm border-2 border-gray-300 p-1"
      >
        {videoDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
      <div className="w-full">
        <input
          type="range"
          className="w-full"
          value={sensitivity}
          max={2}
          min={1}
          step={0.01}
          onChange={(e) => setSensitivity(Number(e.target.value))}
        />
      </div>
      <button
        className="w-full rounded bg-blue-500 p-2 text-white"
        onClick={proceedSetup}
      >
        Start spy
      </button>
    </>
  );
};

export default MicrophoneSelection;
