import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { trpc } from "../utils/trpc";
import type { Session } from "../types/inferred";

export function useCreateSession() {
  return trpc.sessions.createSession.useMutation();
}

export function useEndSession() {
  const router = useRouter();
  return trpc.sessions.endSession.useMutation({
    onSuccess: () => router.push("/history"),
  });
}

export function useActiveSession(redirect?: boolean) {
  const router = useRouter();
  const query = trpc.sessions.getActiveSession.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  if (!!query.data && redirect) {
    router.push(`/sessions/${query.data.id}`);
  }

  return query;
}

const useSessionsGroupedByDate = (data?: Session[]) =>
  useMemo(() => {
    if (!data) return {};
    return data.reduce((prev: Record<string, Session[]>, curr) => {
      const formattedDate = dayjs(curr.startTime).format("YYYY-MM-DD");
      if (!prev[formattedDate]) prev[formattedDate] = [];
      prev[formattedDate]?.push(curr);
      return prev;
    }, {});
  }, [data]);

export function useSessions() {
  const { data, isLoading } = trpc.sessions.getSessions.useQuery({
    limit: 3,
    excludeActive: true,
  });
  const sessions = useSessionsGroupedByDate(data);
  return { data: sessions, isLoading };
}

export function useInfiniteSessions() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.sessions.getInfiniteSessions.useInfiniteQuery(
      { limit: 8 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  const combinedPages = useMemo(() => {
    return data?.pages.flatMap((page) => page.sessions);
  }, [data]);

  const sessions = useSessionsGroupedByDate(combinedPages);

  return {
    data: sessions,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}

export function useSessionDetails(id: string) {
  return trpc.sessions.getSession.useQuery({ id });
}

export function useCreateRecording() {
  return trpc.sessions.createRecording.useMutation();
}

export function useRecordingFile(recordingId: string) {
  return trpc.sessions.getRecordingSignedUrl.useQuery({ recordingId });
}
