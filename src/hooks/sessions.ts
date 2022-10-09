import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

export function useCreateSession() {
  const router = useRouter();
  return trpc.sessions.createSession.useMutation({
    onSuccess: (data) => router.push(`/sessions/${data.id}`),
  });
}
