import AppMessage from '@/components/blocks/app-message';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePaginationNumbers } from '@/hooks/use-pagination-numbers';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { LoaderCircleIcon } from 'lucide-react';
import { z } from 'zod';
import BookmarkCard from './-card';

export const bookmarksSearchSchema = z.object({
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
            page: page,
            pageSize: pageSize,
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
                <PaginationPrevious
                  href={`?page=${pagination.hasPrevious ? page - 1 : 1}`}
                />
              </PaginationItem>

              {nums.map((x) => (
                <PaginationItem key={`pagination-${x}`}>
                  <PaginationLink isActive={x === page} href={`?page=${x}`}>
                    {x}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem aria-disabled={!pagination.hasNext}>
                <PaginationNext
                  href={`?page=${pagination.hasNext ? page + 1 : page}`}
                  aria-disabled={!pagination.hasNext}
                />
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
