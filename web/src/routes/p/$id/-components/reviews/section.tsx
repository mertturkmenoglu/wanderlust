import AppMessage from '@/components/blocks/app-message';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { getRouteApi } from '@tanstack/react-router';
import { LoaderCircleIcon } from 'lucide-react';
import { useMemo } from 'react';
import { ReviewCard } from './card';

export function Section() {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();

  const query = api.useInfiniteQuery(
    'get',
    '/api/v2/reviews/poi/{id}',
    {
      params: {
        path: {
          id: poi.id,
        },
      },
    },
    {
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : null,
    },
  );

  const flat = useMemo(() => {
    if (!query.data) {
      return [];
    }

    return query.data.pages.flatMap((p) => p.reviews);
  }, [query.data]);

  if (query.isLoading) {
    return (
      <LoaderCircleIcon className="animate-spin size-12 text-primary mx-auto my-16 col-span-full" />
    );
  }

  if (query.isError) {
    return (
      <AppMessage
        errorMessage="Something went wrong"
        showBackButton={false}
        className="mx-auto col-span-full my-16"
      />
    );
  }

  if (query.data && flat.length === 0) {
    return (
      <AppMessage
        emptyMessage="There are no reviews yet."
        showBackButton={false}
        className="mx-auto col-span-full my-16"
      />
    );
  }

  if (!query.data) {
    return <></>;
  }

  return (
    <>
      {flat.map((review) => (
        <>
          <ReviewCard review={review} key={review.id} />
          <Separator className="my-2" />
        </>
      ))}
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
    </>
  );
}
