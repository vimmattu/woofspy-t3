import { useMemo } from "react";
import { trpc } from "../utils/trpc";

export function useRecordings(sessionId: string) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.recordings.getRecordings.useInfiniteQuery(
      { sessionId, limit: 8 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  const combinedPages = useMemo(() => {
    return data?.pages.flatMap((page) => page.recordings);
  }, [data]);

  return {
    data: combinedPages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}

export function useCreateRecording() {
  return trpc.recordings.createRecording.useMutation();
}

export function useRecordingFile(recordingId: string) {
  return trpc.recordings.getRecordingFile.useQuery({ recordingId });
}
