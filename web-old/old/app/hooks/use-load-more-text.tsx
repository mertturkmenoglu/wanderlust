type Indicators = {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
};

export function useLoadMoreText({
  isFetchingNextPage,
  hasNextPage,
}: Indicators) {
  return isFetchingNextPage
    ? "Loading more..."
    : hasNextPage
    ? "Load More"
    : "Nothing more to load";
}
