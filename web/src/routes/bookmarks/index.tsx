import AppMessage from '@/components/blocks/app-message';
import { buttonVariants } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { usePaginationNumbers } from '@/hooks/use-pagination-numbers';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LoaderCircleIcon,
} from 'lucide-react';
import { z } from 'zod';
import BookmarkCard from './-card';

const bookmarksSearchSchema = z.object({
  page: z.number().min(1).max(100).default(1).catch(1),
  pageSize: z.number().min(1).max(100).multipleOf(10).default(10).catch(10),
});

export const Route = createFileRoute('/bookmarks/')({
  component: RouteComponent,
  beforeLoad: async ({ context: { auth } }) => {
    if (!auth.user) {
      throw redirect({
        to: '/sign-in',
      });
    }
  },
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/bookmarks/', {
        params: {
          query: {
            page: 1,
            pageSize: 10,
          },
        },
      }),
    );
  },
  validateSearch: bookmarksSearchSchema,
});

function RouteComponent() {
  return (
    <div className="max-w-7xl mx-auto my-16">
      <h2 className="text-2xl font-bold capitalize tracking-tight">
        Your Bookmarks
      </h2>
      <div className="my-8">
        <Bookmarks />
      </div>
    </div>
  );
}

function Bookmarks() {
  const { page, pageSize } = Route.useSearch();
  const query = useQuery(
    api.queryOptions(
      'get',
      '/api/v2/bookmarks/',
      {
        params: {
          query: {
            page,
            pageSize,
          },
        },
      },
      {
        retry: false,
      },
    ),
  );

  const nums = usePaginationNumbers(
    page,
    query.data?.pagination.totalPages ?? 1,
  );

  if (query.error) {
    return (
      <AppMessage
        errorMessage={query.error.title ?? 'Something went wrong'}
        showBackButton={false}
      />
    );
  }

  if (query.data) {
    if (query.data.bookmarks.length === 0) {
      return (
        <AppMessage
          emptyMessage="You have no bookmarks."
          showBackButton={false}
        />
      );
    }

    const { bookmarks, pagination } = query.data;

    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {bookmarks.map((bookmark) => (
          <Link
            to={`/p/$id`}
            params={{
              id: bookmark.poiId,
            }}
            key={bookmark.poiId}
            className="block"
          >
            <BookmarkCard bookmark={bookmark} />
          </Link>
        ))}

        <div className="mt-4 flex justify-center col-span-full">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Link
                  data-slot="pagination-link"
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                    }),
                    'gap-1 px-2.5 sm:pl-2.5',
                  )}
                  aria-label="Go to previous page"
                  to="/bookmarks"
                  search={{
                    page: pagination.hasPrevious ? page - 1 : 1,
                    pageSize,
                  }}
                >
                  <ChevronLeftIcon />
                  <span className="hidden sm:block">Previous</span>
                </Link>
              </PaginationItem>

              {nums.map((x) => (
                <PaginationItem key={`pagination-${x}`}>
                  <Link
                    aria-current={x === page ? 'page' : undefined}
                    data-slot="pagination-link"
                    data-active={x === page}
                    className={cn(
                      buttonVariants({
                        variant: x === page ? 'outline' : 'ghost',
                      }),
                    )}
                    to="/bookmarks"
                    search={{
                      page: x,
                      pageSize,
                    }}
                  >
                    {x}
                  </Link>
                </PaginationItem>
              ))}

              <PaginationItem>
                <Link
                  data-slot="pagination-link"
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                    }),
                    'gap-1 px-2.5 sm:pl-2.5',
                  )}
                  aria-label="Go to next page"
                  to="/bookmarks"
                  search={{
                    page: pagination.hasNext ? page + 1 : page,
                    pageSize,
                  }}
                >
                  <span className="hidden sm:block">Next</span>
                  <ChevronRightIcon />
                </Link>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  }

  return (
    <LoaderCircleIcon className="size-8 animate-spin my-16 text-primary mx-auto" />
  );
}
