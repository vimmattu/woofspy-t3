import { useCallback } from "react";

interface Props {
  stream?: MediaStream;
  src?: string;
}

const Video: React.FC<Props> = ({ stream, src }) => {
  const ref = useCallback(
    (elem: HTMLVideoElement) => {
      if (stream && elem) elem.srcObject = stream;
    },
    [stream]
  );

  return <video ref={ref} src={src} autoPlay muted />;
};

export default Video;
