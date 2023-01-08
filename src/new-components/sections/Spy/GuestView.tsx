import Video from "../../../components/Video";
import WaveForm from "../../../components/WaveForm";
import { Head } from "../../components/Head";
import { useLiveConnection } from "../../../hooks/connection";
import { useState } from "react";

const GuestView: React.FC<{ sessionId?: string }> = ({ sessionId }) => {
  const [stream, setStream] = useState<MediaStream>();

  useLiveConnection({ sessionId, onStreamChanged: setStream });
  const hasVideoTracks = !!stream?.getTracks().filter((d) => d.kind === "video")
    .length;
  const hasAudioTracks = !!stream?.getTracks().filter((d) => d.kind === "audio")
    .length;
  console.log(stream?.getTracks());
  return (
    <>
      <Head title="Spy" />
      {hasVideoTracks && <Video stream={stream} />}
      {hasAudioTracks && <WaveForm stream={stream} />}
    </>
  );
};

export default GuestView;
