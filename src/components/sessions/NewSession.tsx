import { useEffect, useRef, useState } from "react";

const NewSession = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(setStream);
  }, []);

  useEffect(() => {
    if (!stream || !videoRef.current) return;
    videoRef.current.srcObject = stream;
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  return (
    <div>
      <video ref={videoRef} muted autoPlay />
    </div>
  );
};

export default NewSession;
