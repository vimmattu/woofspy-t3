import { InfiniteQueryInput } from "../schema/common.schema";

type InfiniteQueryType = InfiniteQueryInput & Record<string, any>;

type ReturnType = [
  { take: number; cursor: { [key: string]: string } | undefined },
  (result: any[]) => string | null | undefined
];

type InfiniteQueryFn = (
  queryKey: string,
  input: InfiniteQueryType
) => ReturnType;

export const infiniteQuery: InfiniteQueryFn = (queryKey, input) => {
  const limit = input.limit ?? 8;
  const { cursor } = input;

  const query = {
    take: limit + 1,
    cursor: input.cursor ? { [queryKey]: input.cursor } : undefined,
  };

  const getNextCursor = (result: any[]) => {
    let nextCursor: typeof cursor | undefined;
    if (result.length > limit) {
      const nextItem = result.pop();
      nextCursor = nextItem ? nextItem[queryKey] : undefined;
    }
    return nextCursor;
  };

  return [query, getNextCursor];
};
