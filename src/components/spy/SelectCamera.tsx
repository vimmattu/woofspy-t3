import { useState } from "react";
import Head from "next/head";
import { useMediaDevices } from "../../hooks/devices";
import Video from "../Video";
import { BaseDeviceAskProps } from "./types";

const CameraSelection: React.FC<BaseDeviceAskProps> = (props) => {
  const displayInfo = !props.stream && !props.error;

  return (
    <>
      <Head>
        <title>Camera selection</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="mb-2 text-center text-2xl">Camera selection</h1>
      {displayInfo ? (
        <InitialPrompt {...props} />
      ) : (
        <CameraPreview {...props} />
      )}
    </>
  );
};

const InitialPrompt: React.FC<BaseDeviceAskProps> = ({
  proceedSetup,
  askForDevice,
}) => {
  return (
    <>
      <p className="mb-2">
        Choose whether you&apos;d like to use camera or not. Camera use is{" "}
        <i>not</i> required.
      </p>
      <p className="mb-2">
        If you want to use camera, the browser will ask for permissions for
        camera usage.
      </p>
      <button
        className="mb-2 w-full rounded bg-blue-500 p-2 text-white"
        onClick={() => askForDevice()}
      >
        I want to use camera
      </button>
      <button
        title="You will be redirected to select microphone"
        className="w-full rounded bg-red-500 p-2 text-white"
        onClick={() => proceedSetup()}
      >
        I don&apos;t want to use camera
      </button>
    </>
  );
};

const CameraPreview: React.FC<BaseDeviceAskProps> = ({
  stream,
  error,
  proceedSetup,
  onChangeDevice,
}) => {
  const devices = useMediaDevices();
  const [selected, setSelected] = useState<string>();

  const videoDevices = devices.filter((d) => d.kind === "videoinput");
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
      <Video stream={stream} />
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
      <button
        className="w-full rounded bg-blue-500 p-2 text-white"
        onClick={proceedSetup}
      >
        Next
      </button>
    </>
  );
};

export default CameraSelection;
