'use client';

import AppMessage from '@/components/blocks/AppMessage';
import EmptyContent from '@/components/blocks/EmptyContent';
import ReviewCard from '@/components/blocks/ReviewCard';
import { Button } from '@/components/ui/button';
import { api, rpc } from '@/lib/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

async function getReviews(username: string, page: number) {
  return rpc(() =>
    api.reviews.user[':username'].$get({
      param: {
        username,
      },
      query: {
        page: `${page}`,
      },
    })
  );
}

export default function Page() {
  const { username } = useParams();
  const query = useInfiniteQuery({
    queryKey: ['reviews', username],
    queryFn: ({ pageParam }) => {
      if (typeof username !== 'string') {
        throw new Error('Invalid username');
      }

      return getReviews(username, pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : null,
  });

  const isEmpty =
    query.data?.pages.every((page) => page.data.length === 0) ?? true;

  return (
    <div className="mx-auto my-8 max-w-4xl">
      {isEmpty && (
        <AppMessage
          className="my-16"
          emptyMessage="This user has no reviews"
          showBackButton={false}
        />
      )}
      {query.data && (
        <div className="grid grid-cols-1 gap-4">
          {query.data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.map((review) => (
                <Link
                  href={`/location/${review.locationId}`}
                  key={review.id}
                  className="block"
                >
                  <ReviewCard review={review} />
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

      {query.data && query.data.pages.length === 0 && <EmptyContent />}
    </div>
  );
}
