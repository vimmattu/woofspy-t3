import Video from "../../Video";
import WaveForm from "../../WaveForm";
import { Head } from "../../Head";
import { useLiveConnection } from "../../../hooks/connection";
import { useState } from "react";

const GuestView: React.FC<{ sessionId?: string }> = ({ sessionId }) => {
  const [stream, setStream] = useState<MediaStream>();
  useLiveConnection({ sessionId, onStreamChanged: setStream });
  return (
    <>
      <Head title="Spy" />
      <Video stream={stream} muted={false} />
      <WaveForm stream={stream} />
    </>
  );
};

export default GuestView;
