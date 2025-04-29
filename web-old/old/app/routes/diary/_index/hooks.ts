import { useInfiniteQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { listDiaryEntries } from "~/lib/api";

export function useDiaryEntriesQuery(date?: DateRange) {
  return useInfiniteQuery({
    queryKey: ["diary", date?.from, date?.to],
    queryFn: ({ pageParam }) => {
      const from = date?.from ? format(date.from, "yyyy-MM-dd") : undefined;
      const to = date?.to ? format(date.to, "yyyy-MM-dd") : undefined;

      if (from !== undefined && to !== undefined) {
        return listDiaryEntries(pageParam, 25, from, to);
      }

      return listDiaryEntries(pageParam, 25);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : null,
  });
}

export function useLoadMoreText(
  query: ReturnType<typeof useDiaryEntriesQuery>
) {
  if (query.isFetchingNextPage) {
    return "Loading...";
  }

  if (query.hasNextPage) {
    return "Load more";
  }

  return "Nothing more to load";
}
