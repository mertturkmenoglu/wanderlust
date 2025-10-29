import { api } from '@/lib/api';
import { useSearch } from '@tanstack/react-router';

export function useBookmarksQuery() {
  const { page, pageSize } = useSearch({
    from: '/bookmarks/',
  });

  return api.useSuspenseQuery(
    'get',
    '/api/v2/bookmarks/',
    {
      params: {
        query: {
          page,
          pageSize,
        },
      },
    },
    {
      retry: false,
    },
  );
}
