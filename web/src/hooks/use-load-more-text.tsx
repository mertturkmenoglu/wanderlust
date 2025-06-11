type Indicators = {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
};

export function useLoadMoreText({
  isFetchingNextPage,
  hasNextPage,
}: Indicators) {
  if (isFetchingNextPage) {
    return 'Loading more...';
  }

  if (hasNextPage) {
    return 'Load More';
  }

  return 'Nothing more to load';
}
