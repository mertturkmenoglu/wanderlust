import AppMessage from '@/components/blocks/app-message';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { createFileRoute, Link } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/u/$username/lists/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { username } = Route.useParams();
  const query = api.useInfiniteQuery(
    'get',
    '/api/v2/lists/user/{username}',
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
      getNextPageParam: (lastPage) =>
        lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : null,
      pageParamName: 'page',
      retry: false,
      enabled: username !== '',
    },
  );

  return (
    <div>
      {query.isLoading && (
        <AppMessage
          emptyMessage="Loading..."
          showBackButton={false}
          className="my-16"
        />
      )}
      {query.data && query.data.pages[0]?.lists.length === 0 && (
        <AppMessage
          emptyMessage="No lists yet"
          showBackButton={false}
          className="my-16"
        />
      )}
      {query.data && (
        <div className="grid grid-cols-1 gap-4">
          {query.data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.lists.map((list) => (
                <Link
                  to="/lists/$id"
                  params={{
                    id: list.id,
                  }}
                  key={list.id}
                  className="block"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-primary hover:underline">
                        {list.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Created at:{' '}
                        {new Date(list.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
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
