import { InferredSessionType } from "./types";

interface Props {
  session: InferredSessionType;
}

const PastSession: React.FC<Props> = ({ session }) => {
  return (
    <div>
      <h1>Session {session.startTime.toLocaleString()}</h1>
    </div>
  );
};

export default PastSession;
