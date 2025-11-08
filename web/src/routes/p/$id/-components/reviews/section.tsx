import { AppMessage } from '@/components/blocks/app-message';
import { buttonVariants } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import { usePaginationNumbers } from '@/hooks/use-pagination-numbers';
import { api } from '@/lib/api';
import type { components } from '@/lib/api-types';
import { cn } from '@/lib/utils';
import { getRouteApi, Link } from '@tanstack/react-router';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LoaderCircleIcon,
} from 'lucide-react';
import { ReviewCard } from './card';

export function Section() {
  const route = getRouteApi('/p/$id/');
  const { place } = route.useLoaderData();
  const search = route.useSearch();

  const query = api.useQuery('get', '/api/v2/reviews/place/{id}', {
    params: {
      path: {
        id: place.id,
      },
      query: {
        pageSize: 10,
        page: search.page ?? 1,
        maxRating: search.maxRating,
        minRating: search.minRating,
        sortBy: search.sortBy,
        sortOrd: search.sortOrd,
      },
    },
  });

  const nums = usePaginationNumbers(
    search.page ?? 1,
    query.data?.pagination.totalPages ?? 1,
  );

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

  if (query.data && query.data.pagination.totalRecords === 0) {
    return (
      <AppMessage
        emptyMessage="There are no reviews yet."
        showBackButton={false}
        className="mx-auto col-span-full my-16"
      />
    );
  }

  if (!query.data) {
    return null;
  }

  const { reviews, pagination } = query.data;
  const sortedReviews = (() => {
    if (search.sortOrd === 'asc' && search.sortBy === 'created_at') {
      const sorted: components['schemas']['Review'][] = [];
      for (const v of reviews) {
        sorted.unshift(v);
      }
      return sorted;
    }

    if (search.sortBy === 'rating') {
      if (search.sortOrd === 'asc') {
        return reviews.sort((a, b) => a.rating - b.rating);
      }
      return reviews.sort((a, b) => b.rating - a.rating);
    }

    return reviews;
  })();

  return (
    <>
      {sortedReviews.map((review, i) => (
        <div key={review.id}>
          <ReviewCard review={review} />
          {i !== reviews.length - 1 && <Separator className="my-2" />}
        </div>
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
                to="/p/$id"
                params={{
                  id: place.id,
                }}
                hash="reviews"
                search={(prev) => ({
                  ...prev,
                  page: pagination.hasPrevious ? (search.page ?? 1) - 1 : 1,
                })}
              >
                <ChevronLeftIcon />
                <span className="hidden sm:block">Previous</span>
              </Link>
            </PaginationItem>

            {nums.map((x) => (
              <PaginationItem key={`pagination-${x}`}>
                <Link
                  aria-current={x === (search.page ?? 1) ? 'page' : undefined}
                  data-slot="pagination-link"
                  data-active={x === (search.page ?? 1)}
                  className={cn(
                    buttonVariants({
                      variant: x === (search.page ?? 1) ? 'outline' : 'ghost',
                    }),
                  )}
                  to="/p/$id"
                  params={{
                    id: place.id,
                  }}
                  hash="reviews"
                  search={(prev) => ({
                    ...prev,
                    page: x,
                  })}
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
                to="/p/$id"
                params={{
                  id: place.id,
                }}
                hash="reviews"
                search={(prev) => ({
                  ...prev,
                  page: pagination.hasNext
                    ? (search.page ?? 1) + 1
                    : search.page,
                })}
              >
                <span className="hidden sm:block">Next</span>
                <ChevronRightIcon />
              </Link>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
