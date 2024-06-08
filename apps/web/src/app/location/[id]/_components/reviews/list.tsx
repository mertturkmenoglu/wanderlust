'use client';

import EmptyContent from '@/components/blocks/EmptyContent';
import ReviewCard from '@/components/blocks/ReviewCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api, rpc } from '@/lib/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';

type Props = {
  locationId: string;
};

async function getReviews(locationId: string, page: number) {
  return rpc(() =>
    api.reviews.location[':id'].$get({
      param: {
        id: locationId,
      },
      query: {
        page: `${page}`,
      },
    })
  );
}

export default function ReviewList({ locationId }: Props) {
  const query = useInfiniteQuery({
    queryKey: ['reviews', locationId],
    queryFn: ({ pageParam }) => getReviews(locationId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : null,
  });

  if (query.isLoading) {
    return (
      <div className="mt-16 flex w-full justify-center">
        <Skeleton className="h-32 w-full rounded" />
      </div>
    );
  }

  if (query.isError) {
    return <div>Error</div>;
  }

  return (
    <div className="my-16 space-y-4">
      {query.data && query.data.pages.length === 0 && (
        <EmptyContent showBackButton={false} />
      )}
      {query.data && (
        <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-4">
          {query.data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                />
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
