import { AppMessage } from '@/components/blocks/app-message';
import { Button } from '@/components/ui/button';
import { useLoadMoreText } from '@/hooks/use-load-more-text';
import { api } from '@/lib/api';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { GlobeIcon, LockIcon } from 'lucide-react';
import React from 'react';
import { Header } from './-components/header';

export const Route = createFileRoute('/lists/')({
  component: RouteComponent,
  beforeLoad: ({ context: { auth } }) => {
    if (!auth.user) {
      throw redirect({
        to: '/sign-in',
      });
    }
  },
});

function RouteComponent() {
  const query = api.useInfiniteQuery(
    'get',
    '/api/v2/lists/',
    {
      params: {
        query: {
          pageSize: 20,
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
    },
  );

  const btnText = useLoadMoreText({
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  });

  return (
    <div className="max-w-7xl my-8 mx-auto">
      <Header />

      {query.isLoading && (
        <AppMessage
          emptyMessage="Loading..."
          showBackButton={false}
        />
      )}
      {query.data && query.data.pages[0]?.lists.length === 0 && (
        <AppMessage emptyMessage="You have no lists yet" />
      )}
      {query.data && (
        <div className="grid grid-cols-1 gap-2 mt-4">
          {query.data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.lists.map((list) => (
                <Link
                  to="/lists/$id"
                  params={{
                    id: list.id,
                  }}
                  key={list.id}
                  className="block p-2 rounded-lg transition-colors hover:bg-primary/5"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      {list.isPublic ? (
                        <GlobeIcon className="size-4" />
                      ) : (
                        <LockIcon className="size-4" />
                      )}
                    </div>
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
            {btnText}
          </Button>
        </div>
      )}
    </div>
  );
}
