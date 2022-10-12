import { useEffect, useRef } from "react";

interface IActivityRecorder {
  stream?: MediaStream;
  onFinish?: (ev: BlobEvent) => void;
}

export const useActivityRecorder = ({
  stream,
  onFinish,
}: IActivityRecorder) => {
  const recorder = useRef<MediaRecorder>();

  useEffect(() => {
    if (!stream || !onFinish) return;

    const mimeType = !!stream.getVideoTracks().length
      ? "video/webm"
      : !!stream.getAudioTracks().length
      ? "audio/webm"
      : undefined;

    recorder.current = new MediaRecorder(stream, { mimeType });
    recorder.current?.addEventListener("dataavailable", onFinish);

    return () => {
      if (recorder.current?.state === "recording") recorder.current?.stop();
      recorder.current?.removeEventListener("dataavailable", onFinish);
    };
  }, [stream]);

  return {
    start: () => recorder.current?.start(),
    end: () => recorder.current?.stop(),
  };
};
