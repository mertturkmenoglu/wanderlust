'use client';

import { Button } from '@/components/ui/button';
import { api, rpc } from '@/lib/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';
import BookmarkCard from './_components/bookmark-card';

function getBookmarks(page: number) {
  return rpc(() => api.bookmarks.$get({ query: { page: `${page}` } }));
}

export default function Page() {
  const query = useInfiniteQuery({
    queryKey: ['bookmarks'],
    queryFn: ({ pageParam }) => getBookmarks(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : null,
  });

  return (
    <div className="mt-8">
      {query.data && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {query.data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.map((bookmark) => (
                <Link
                  href={`/location/${bookmark.locationId}`}
                  key={bookmark.locationId}
                  className="block"
                >
                  <BookmarkCard bookmark={bookmark} />
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
  );
}
