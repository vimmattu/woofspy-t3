import dayjs from "dayjs";
import { useMemo } from "react";
import { trpc } from "../utils/trpc";
import type { Session } from "../types/inferred";
import { useToast } from "@chakra-ui/react";

export function useCreateSession() {
  const toast = useToast();
  return trpc.spySessions.createSession.useMutation({
    onSuccess: () => {
      toast({
        title: "Session started",
        status: "success",
        isClosable: true,
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        isClosable: true,
      });
    },
  });
}

export function useEndSession() {
  const toast = useToast();
  return trpc.spySessions.endSession.useMutation({
    onSuccess: () => {
      toast({
        title: "Session ended",
        status: "success",
        isClosable: true,
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        isClosable: true,
      });
    },
  });
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

export function useSessions(opts?: {
  isActive?: boolean;
  hasEnded?: boolean;
  limit?: number;
}) {
  const { data, isLoading } = trpc.spySessions.getSessions.useQuery({
    limit: opts?.limit ?? 3,
    isActive: opts?.isActive ?? false,
    hasEnded: opts?.hasEnded ?? false,
  });
  const sessions = useSessionsGroupedByDate(data?.sessions);
  return { data: sessions, isLoading };
}

export function useInfiniteSessions() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.spySessions.getSessions.useInfiniteQuery(
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
  return trpc.spySessions.getSession.useQuery({ id });
}
