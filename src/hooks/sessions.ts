import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

export function useCreateSession() {
  const router = useRouter();
  return trpc.sessions.createSession.useMutation({
    onSuccess: ({ id }) => router.push(`/sessions/${id}`),
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
