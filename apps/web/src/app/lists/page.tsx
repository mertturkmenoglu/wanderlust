'use client';

import { Button } from '@/components/ui/button';
import { api, rpc } from '@/lib/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

async function getLists(page: number) {
  return rpc(() => api.lists.my.$get({ query: { page: `${page}` } }));
}

export default function Page() {
  const query = useInfiniteQuery({
    queryKey: ['lists'],
    queryFn: ({ pageParam }) => getLists(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : null,
  });

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Lists</h2>
        <Button
          asChild
          size="sm"
          variant="default"
        >
          <Link href="/lists/new">
            <span>New List</span>
            <Plus className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
      <hr className="my-2" />
      <div className="mt-8">
        {query.data && (
          <div className="grid grid-cols-1 gap-4">
            {query.data.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.data.map((list) => (
                  <Link
                    href={`/lists/${list.id}`}
                    key={list.id}
                    className="block"
                  >
                    {list.name}
                  </Link>
                ))}
              </React.Fragment>
            ))}
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
    </>
  );
}
