import Video from "../../Video";
import WaveForm from "../../WaveForm";
import { Head } from "../../Head";
import { useLiveConnection } from "../../../hooks/connection";
import { useState } from "react";

const GuestView: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const [stream, setStream] = useState<MediaStream>();
  useLiveConnection({ sessionId, onRemoteStream: setStream });

  return (
    <>
      <Head title="Spy" />
      <Video stream={stream} />
      <WaveForm stream={stream} />
    </>
  );
};

export default GuestView;
