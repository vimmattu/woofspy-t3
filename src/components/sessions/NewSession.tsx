import { useEffect, useRef } from "react";
import { useMediaStream } from "../../hooks/recorder";

// TODO: Confirm page leave from user

const NewSession = () => {
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
