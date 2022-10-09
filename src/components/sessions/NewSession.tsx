import { useEffect, useRef } from "react";
import { useMediaStream } from "../../hooks/recorder";
import { InferredSessionType } from "./types";

// TODO: Confirm page leave from user

interface Props {
  session: InferredSessionType;
}

const NewSession: React.FC<Props> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stream = useMediaStream();

  useEffect(() => {
    if (!videoRef.current || !stream) return;
    videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div>
      <video ref={videoRef} autoPlay muted />
    </div>
  );
};

export default NewSession;
