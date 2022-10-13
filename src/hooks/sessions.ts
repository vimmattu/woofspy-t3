import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

export function useCreateSession() {
  const router = useRouter();
  return trpc.sessions.createSession.useMutation({
    onSuccess: ({ id }) => router.push(`/sessions/${id}`),
  });
}

export function useEndSession() {
  const router = useRouter();
  return trpc.sessions.endSession.useMutation({
    onSuccess: () => router.push("/sessions"),
  });
}

export function useActiveSession(redirect?: boolean) {
  const router = useRouter();
  const query = trpc.sessions.getActiveSession.useQuery();

  if (!!query.data && redirect) {
    router.push(`/sessions/${query.data.id}`);
  }

  return query;
}

export function useSessions() {
  return trpc.sessions.getSessions.useQuery();
}

export function useSessionDetails(id: string) {
  return trpc.sessions.getSession.useQuery({ id });
}

export function useCreateRecording() {
  return trpc.sessions.createRecording.useMutation();
}

export function useRecordingFile(recordingId: string) {
  return trpc.sessions.getRecordingSignedUrl.useQuery(
    { recordingId },
    { enabled: false }
  );
}
