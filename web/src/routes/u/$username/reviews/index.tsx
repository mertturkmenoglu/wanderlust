import AppMessage from '@/components/blocks/app-message';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import Card from './-card';

export const Route = createFileRoute('/u/$username/reviews/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { username } = Route.useParams();
  const query = api.useInfiniteQuery(
    'get',
    '/api/v2/reviews/user/{username}',
    {
      params: {
        path: {
          username,
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

  return (
    <div>
      {query.isLoading && (
        <AppMessage
          emptyMessage="Loading..."
          showBackButton={false}
          className="my-16"
        />
      )}

      {query.data && flat.length === 0 && (
        <AppMessage
          emptyMessage="No reviews yet"
          showBackButton={false}
          className="my-16"
        />
      )}

      {query.data && (
        <div className="grid grid-cols-1 gap-4">
          {flat.map((review, j) => (
            <Card
              key={review.id}
              review={review}
              isLast={j === flat.length - 1}
            />
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
