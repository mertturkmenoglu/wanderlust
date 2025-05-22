import { fetchClient } from '@/lib/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { type DateRange } from 'react-day-picker';

export function useDiaryEntriesQuery(date?: DateRange) {
  return useInfiniteQuery({
    queryKey: ['diary', date?.from, date?.to],
    queryFn: async ({ pageParam }) => {
      const from = date?.from ? format(date.from, 'yyyy-MM-dd') : undefined;
      const to = date?.to ? format(date.to, 'yyyy-MM-dd') : undefined;

      if (from !== undefined && to !== undefined) {
        const res = await fetchClient.GET('/api/v2/diary/', {
          params: {
            query: {
              page: pageParam,
              pageSize: 10,
              from: from,
              to: to,
            },
          },
        });

        if (res.error) {
          throw res.error;
        }

        return res.data;
      }

      const res = await fetchClient.GET('/api/v2/diary/', {
        params: {
          query: {
            page: pageParam,
            pageSize: 10,
          },
        },
      });

      if (res.error) {
        throw res.error;
      }

      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : null,
  });
}
