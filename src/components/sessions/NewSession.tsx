import { useEffect, useRef } from "react";
import {
  DetectorState,
  useActivityRecorder,
  useMediaStream,
} from "../../hooks/recorder";
import { useEndSession } from "../../hooks/sessions";
import { InferredSessionType } from "./types";

// TODO: Confirm page leave from user

interface Props {
  session: InferredSessionType;
}

const DETECTOR_STATE = {
  [DetectorState.IDLE]: "Idle",
  [DetectorState.RECORDING]: "Recording",
  [DetectorState.PROCESSING]: "Processing",
};

const NewSession: React.FC<Props> = ({ session }) => {
  const { mutate: endSession, isLoading } = useEndSession();
  const videoRef = useRef<HTMLVideoElement>(null);
  const stream = useMediaStream();
  const { detectorState, startDetector, detectorStarted } = useActivityRecorder(
    session.id,
    stream
  );

  useEffect(() => {
    !detectorStarted && startDetector();
  }, [detectorStarted, startDetector]);

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
      <p>Detector State: {DETECTOR_STATE[detectorState]}</p>
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
