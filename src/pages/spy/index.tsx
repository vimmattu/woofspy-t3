import Video from "../../components/Video";
import { useMediaDevices, useMediaStream } from "../../hooks/devices";

enum Step {
  SELECT_CAMERA,
  SELECT_MICROPHONE,
  SET_SENSITIVITY,
  DONE,
}

export default function SpyPage() {
  const devices = useMediaDevices();
  const { stream, error } = useMediaStream();
  console.log(devices);

  return (
    <main className="w-full px-4 md:w-1/2 xl:w-1/3">
      <h1 className="text-center text-2xl">Select your camera</h1>
      {error ? (
        <p className="text-center text-red-500">{error.message}</p>
      ) : (
        !stream && (
          <p className="text-center">
            You will be asked to allow permissions for camera and microphone
            use. Please allow <i>at least</i> microphone usage.
          </p>
        )
      )}
      {stream && <Video stream={stream} />}
    </main>
  );
}
