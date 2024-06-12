'use client';

import { Button } from '@/components/ui/button';
import { api, rpc } from '@/lib/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { reportCols } from '../_components/columns';
import { DataTable } from '../_components/data-table';

async function getReports(page: number) {
  return rpc(() =>
    api.reports.$get({
      query: {
        page: `${page}`,
      },
    })
  );
}

export default function Page() {
  const query = useInfiniteQuery({
    queryKey: ['reports'],
    queryFn: ({ pageParam }) => getReports(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : null,
  });

  const data = useMemo(() => {
    if (!query.data) {
      return [];
    }

    return query.data.pages.map((p) => p.data).flat();
  }, [query.data]);

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold tracking-tight">Reports</h3>
      {data.length && (
        <div className="lg:grid-cols- grid grid-cols-1 gap-4">
          <DataTable
            columns={reportCols}
            data={data}
            hrefPrefix="/dashboard/reports"
          />
        </div>
      )}
      {query.hasNextPage && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => query.fetchNextPage()}
            disabled={!query.hasNextPage || query.isFetchingNextPage}
          >
            {query.isFetchingNextPage
              ? 'Loading more...'
              : query.hasNextPage
                ? 'Load More'
                : 'Nothing more to load'}
          </Button>
        </div>
      )}
    </div>
  );
}
