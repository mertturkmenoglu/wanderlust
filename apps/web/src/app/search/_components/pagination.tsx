import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePagination } from 'react-instantsearch';

export default function SearchPagination() {
  const {
    pages,
    currentRefinement,
    nbPages,
    isFirstPage,
    isLastPage,
    refine,
    createURL,
  } = usePagination();
  const previousPageIndex = currentRefinement - 1;
  const nextPageIndex = currentRefinement + 1;

  return (
    <div className="my-4">
      <Pagination>
        <PaginationContent>
          {!isFirstPage && (
            <PaginationItem>
              <PaginationPrevious
                href={createURL(previousPageIndex)}
                onClick={() => refine(previousPageIndex)}
                aria-disabled={isFirstPage}
              />
            </PaginationItem>
          )}
          {pages[0] !== 0 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href={createURL(page)}
                onClick={() => refine(page)}
                aria-label={`Page ${page + 1}`}
                isActive={currentRefinement === page}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {pages.at(-1) !== nbPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {!isLastPage && (
            <PaginationItem>
              <PaginationNext
                href={createURL(nextPageIndex)}
                onClick={() => refine(nextPageIndex)}
                aria-disabled={isLastPage}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
      <div className="flex justify-center text-sm text-muted-foreground">
        {currentRefinement + 1} / {nbPages} pages
      </div>
    </div>
  );
}
