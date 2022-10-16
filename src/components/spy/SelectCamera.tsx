import { useEffect } from "react";
import Video from "../Video";
import { BaseDeviceAskProps, BaseProps } from "./types";

const CameraSelection: React.FC<BaseDeviceAskProps> = ({
  proceedSetup,
  stream,
  askForDevice,
  error,
}) => {
  const displayInfo = !stream && !error;

  return (
    <>
      <h1 className="mb-2 text-center text-2xl">Camera selection</h1>
      {displayInfo && (
        <>
          <p className="mb-2">
            Choose whether you&apos;d like to use camera or not. Camera use is{" "}
            <i>not</i> required.
          </p>
          <p className="mb-2">
            If you want to use camera, the browser will ask for permissions for
            camera usage.
          </p>
        </>
      )}
      {error && (
        <>
          <h2 className="text-center text-xl text-red-500">
            Error happened :(
          </h2>
          <p className="text-center text-red-500">{error.message}</p>
        </>
      )}
      {stream && <Video stream={stream} />}
      {displayInfo && (
        <>
          <button
            className="mb-2 w-full rounded bg-blue-500 p-2 text-white"
            onClick={askForDevice}
          >
            I want to use camera
          </button>
          <button
            title="You will be redirected to select microphone"
            className="w-full rounded bg-red-500 p-2 text-white"
            onClick={proceedSetup}
          >
            I don&apos;t want to use camera
          </button>
        </>
      )}
    </>
  );
};

export default CameraSelection;
