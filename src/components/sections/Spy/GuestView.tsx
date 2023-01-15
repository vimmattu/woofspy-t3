import Video from "../../Video";
import WaveForm from "../../WaveForm";
import { Head } from "../../Head";
import { useLiveConnection } from "../../../hooks/connection";
import { useState } from "react";
import { Button } from "@chakra-ui/react";

const GuestView: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const [ready, setReady] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  useLiveConnection({
    sessionId,
    isHost: false,
    onRemoteStream: setStream,
    canConnect: ready,
  });

  if (!ready) return <Button onClick={() => setReady(true)}>Join</Button>;

  console.log(stream);
  return (
    <>
      <Head title="Spy" />
      <Video stream={stream} muted={false} />
      <WaveForm stream={stream} />
    </>
  );
};

export default GuestView;
