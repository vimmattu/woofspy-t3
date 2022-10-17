import Video from "../Video";
import WaveForm from "../WaveForm";
import { BaseProps } from "./types";

const SpyView: React.FC<BaseProps> = ({ stream, error, proceedSetup }) => {
  const hasVideoTracks = !!stream?.getTracks().filter((d) => d.kind === "video")
    .length;
  return (
    <>
      <h1 className="mb-2 text-center text-2xl">Spy</h1>
      {hasVideoTracks && <Video stream={stream} />}
      <WaveForm stream={stream} />
    </>
  );
};

export default SpyView;
