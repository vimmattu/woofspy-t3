import Video from "../Video";
import WaveForm from "../WaveForm";
import { BaseProps } from "./types";

const SpyView: React.FC<BaseProps> = ({ stream, error, proceedSetup }) => {
  return (
    <>
      <h1 className="mb-2 text-center text-2xl">Spy</h1>
      <Video stream={stream} />
      <WaveForm stream={stream} />
    </>
  );
};

export default SpyView;
