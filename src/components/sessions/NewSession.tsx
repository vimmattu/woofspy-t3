import { useEffect, useRef } from "react";
import { useActivityDetector } from "../../hooks/detector";
import { useMediaStream } from "../../hooks/devices";
import { useActivityRecorder } from "../../hooks/recorder";
import { useEndSession } from "../../hooks/sessions";
import { InferredSessionType } from "./types";

// TODO: Confirm page leave from user

interface Props {
  session: InferredSessionType;
}

const NewSession: React.FC<Props> = ({ session }) => {
  const { mutate: endSession, isLoading } = useEndSession();
  const videoRef = useRef<HTMLVideoElement>(null);
  const stream = useMediaStream();
  const { start: onStart, end: onEnd } = useActivityRecorder({
    stream,
    onFinish: (ev) => console.log("EVENT!", ev),
  });
  useActivityDetector({
    stream,
    onStart,
    onEnd,
    sensitivity: 1.5,
  });

  useEffect(() => {
    if (!videoRef.current || !stream) return;
    videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-2 text-center text-3xl">Woof spy</h1>
      <div className="mb-2 bg-black">
        <video ref={videoRef} autoPlay muted />
      </div>
      <button
        className="padding-2 rounded bg-red-600 px-4 py-2 text-xl text-white shadow transition-colors hover:bg-red-700 focus:bg-red-700"
        onClick={() => endSession({ id: session.id })}
        disabled={isLoading}
      >
        End spy
      </button>
    </div>
  );
};

export default NewSession;
