import { useCallback } from "react";
import { useActivityDetector } from "../../hooks/detector";
import { useActivityRecorder } from "../../hooks/recorder";
import { useCreateRecording } from "../../hooks/sessions";
import Video from "../Video";
import WaveForm from "../WaveForm";
import { BaseProps } from "./types";

const SpyView: React.FC<BaseProps & { sessionId?: string }> = ({
  stream,
  proceedSetup,
  sessionId,
}) => {
  const { mutateAsync: createRecording } = useCreateRecording();

  const onRecordingAvailable = useCallback(
    async (event: BlobEvent) => {
      if (!sessionId) return;

      const { url, fields } = await createRecording({ sessionId });

      const data = {
        ...fields,
        //"Content-Type": event.data.type, // TODO: add content-type
        file: event.data,
      };

      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) => formData.append(key, val));

      fetch(url, {
        method: "POST",
        body: formData,
      });
    },
    [sessionId, createRecording]
  );

  const { start: onStart, end: onEnd } = useActivityRecorder({
    stream,
    onFinish: onRecordingAvailable,
  });

  const detectActive = useActivityDetector({
    stream,
    onStart,
    onEnd,
    sensitivity: 1.5,
  });

  const hasVideoTracks = !!stream?.getTracks().filter((d) => d.kind === "video")
    .length;
  return (
    <>
      <h1 className="mb-2 text-center text-2xl">Spy</h1>
      {hasVideoTracks && <Video stream={stream} />}
      <WaveForm stream={stream} />
      <button
        className="w-full rounded bg-red-500 p-2 text-white"
        onClick={() => proceedSetup()}
      >
        End spy
      </button>
    </>
  );
};

export default SpyView;
