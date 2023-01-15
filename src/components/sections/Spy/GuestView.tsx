import Video from "../../Video";
import WaveForm from "../../WaveForm";
import { Head } from "../../Head";
import { useLiveConnection } from "../../../hooks/connection";
import { useStream } from "../../../hooks/devices";

const GuestView: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const [stream] = useStream();
  useLiveConnection(sessionId);
  return (
    <>
      <Head title="Spy" />
      <Video stream={stream} muted={false} />
      <WaveForm stream={stream} />
    </>
  );
};

export default GuestView;
