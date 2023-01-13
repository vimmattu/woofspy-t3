import { useCallback } from "react";

interface Props {
  stream?: MediaStream;
  src?: string;
  autoPlay?: boolean;
  muted?: boolean;
}

const StreamRenderer: React.FC<Props> = ({
  stream,
  src,
  autoPlay = true,
  muted = true,
}) => {
  const ref = useCallback(
    (elem: HTMLVideoElement) => {
      if (stream && elem) elem.srcObject = stream;
    },
    [stream]
  );

  if (!stream) return null;

  if (!stream.getTracks().filter((d) => d.kind === "video").length)
    return <audio ref={ref} autoPlay={autoPlay} muted={muted} />;

  return (
    <video
      style={{ width: "100%" }}
      ref={ref}
      src={src}
      autoPlay={autoPlay}
      muted={muted}
    />
  );
};

export default StreamRenderer;
