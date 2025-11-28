import { api } from '@/lib/api';

export function useListsQuery() {
  return api.useInfiniteQuery(
    'get',
    '/api/v2/lists/',
    {
      params: {
        query: {
          pageSize: 10,
        },
      },
    },
    {
      initialPageParam: 1,
      getNextPageParam: (lastPage: {
        pagination: { hasNext: boolean; page: number };
      }) => {
        if (!lastPage.pagination.hasNext) {
          return null;
        }
        return lastPage.pagination.page + 1;
      },
      pageParamName: 'page',
      retry: false,
    },
  );
}
