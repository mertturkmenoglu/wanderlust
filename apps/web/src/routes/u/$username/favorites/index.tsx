import { AppMessage } from '@/components/blocks/app-message';
import { Button } from '@/components/ui/button';
import { useLoadMoreText } from '@/hooks/use-load-more-text';
import { api } from '@/lib/api';
import { createFileRoute, Link } from '@tanstack/react-router';
import { LoaderCircleIcon } from 'lucide-react';
import { FavoriteCard } from './-favorite-card';

export const Route = createFileRoute('/u/$username/favorites/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { username } = Route.useParams();
  const query = api.useInfiniteQuery(
    'get',
    '/api/v2/favorites/{username}',
    {
      params: {
        path: {
          username,
        },
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
      enabled: username !== null,
    },
  );

  const btnText = useLoadMoreText({
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  });

  if (query.error) {
    return (
      <AppMessage
        errorMessage="Something went wrong"
        className="my-16"
        showBackButton={false}
      />
    );
  }

  if (query.data) {
    const pages = query.data.pages;
    const isEmpty = pages[0]?.favorites.length === 0;
    const flatten = pages.flatMap((p) => p.favorites);

    if (isEmpty) {
      return (
        <AppMessage
          emptyMessage="No favorites"
          showBackButton={false}
          className="my-16"
        />
      );
    }

    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          {flatten.map((favorite) => (
            <Link
              to="/p/$id"
              key={favorite.placeId}
              params={{ id: favorite.placeId }}
            >
              <FavoriteCard favorite={favorite} />
            </Link>
          ))}
        </div>
        {query.hasNextPage && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => {
                query.fetchNextPage();
              }}
              disabled={!query.hasNextPage || query.isFetchingNextPage}
            >
              {btnText}
            </Button>
          </div>
        )}
      </>
    );
  }

  return (
    <LoaderCircleIcon className="my-16 mx-auto size-8 text-primary animate-spin" />
  );
}
