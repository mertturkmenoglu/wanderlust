import AppMessage from '@/components/blocks/app-message';
import Spinner from '@/components/kit/spinner';
import { Button } from '@/components/ui/button';
import { useLoadMoreText } from '@/hooks/use-load-more-text';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { getRouteApi } from '@tanstack/react-router';
import { Item } from './-item';

type Props = {
  className?: string;
};

export function Comments({ className }: Props) {
  const route = getRouteApi('/trips/$id');
  const { trip } = route.useLoaderData();

  const query = api.useInfiniteQuery(
    'get',
    '/api/v2/trips/{id}/comments/',
    {
      params: {
        path: {
          id: trip.id,
        },
        query: {
          pageSize: 10,
        },
      },
    },
    {
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
      pageParamName: 'page',
      retry: false,
    },
  );

  const btnText = useLoadMoreText({
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  });

  if (query.error) {
    return (
      <AppMessage
        errorMessage="Failed to load comments"
        showBackButton={false}
        className="my-8"
      />
    );
  }

  if (query.isFetching) {
    return <Spinner className="my-8 mx-auto size-8" />;
  }

  if (!query.data) {
    return (
      <AppMessage
        emptyMessage="No comments yet"
        showBackButton={false}
        className="my-8"
      />
    );
  }

  const pages = query.data.pages;
  const isEmpty = pages[0]?.comments.length === 0;
  const flatten = pages.flatMap((p) => p.comments);

  if (isEmpty) {
    return (
      <AppMessage
        emptyMessage="No comments yet"
        showBackButton={false}
        className="my-8"
      />
    );
  }

  return (
    <div className={cn(className)}>
      {flatten.map((comment) => (
        <Item key={comment.id} comment={comment} />
      ))}

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
    </div>
  );
}
