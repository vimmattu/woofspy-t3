import { inferProcedureOutput } from "@trpc/server";
import { useRecordingFile } from "../../hooks/sessions";
import { AppRouter } from "../../server/trpc/router";

type InferredSessionType = inferProcedureOutput<
  AppRouter["sessions"]["getSessions"]
>[""][0];

interface Props {
  session: InferredSessionType;
}

const PastSession: React.FC<Props> = ({ session }) => {
  // const { data, isLoading } = useRecordingFile(session.id);

  return (
    <div>
      <h1>Session {session.startTime.toLocaleString()}</h1>
      {session.recordings
        .slice()
        .reverse()
        .map((recording) => (
          <Recording key={recording.id} recording={recording} />
        ))}
    </div>
  );
};

const Recording: React.FC<{
  recording: InferredSessionType["recordings"][0];
}> = ({ recording }) => {
  const { data, refetch: fetchFile } = useRecordingFile(recording.id);

  return (
    <div>
      <p>{recording.sessionId}</p>
      {data ? (
        <video src={data} controls />
      ) : (
        <button onClick={() => fetchFile()}>See video</button>
      )}
    </div>
  );
};

export default PastSession;
