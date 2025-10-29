import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { NavigationButton } from './-navigation-button';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, useSearch } from '@tanstack/react-router';
import { usePaginationNumbers } from '@/hooks/use-pagination-numbers';

type Props = {
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

export function Navigation({ totalPages, hasPrevious, hasNext }: Props) {
  const { page, pageSize } = useSearch({
    from: '/bookmarks/',
  });

  const nums = usePaginationNumbers(page, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <NavigationButton
          type="previous"
          hasPrevious={hasPrevious}
        />

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

        <NavigationButton
          type="next"
          hasNext={hasNext}
        />
      </PaginationContent>
    </Pagination>
  );
}
