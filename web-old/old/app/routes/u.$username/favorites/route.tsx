import { Link, useParams } from "react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import AppMessage from "~/components/blocks/app-message";
import { Button } from "~/components/ui/button";
import { getUserFavoritesByUsername } from "~/lib/api-requests";
import FavoriteCard from "./favorite-card";
import { LoaderCircleIcon } from "lucide-react";
import { useLoadMoreText } from "~/hooks/use-load-more-text";

export default function Page() {
  const params = useParams();
  const username = params.username;
  const query = useInfiniteQuery({
    queryKey: ["user-favorites", username],
    queryFn: ({ pageParam }) =>
      getUserFavoritesByUsername(username ?? "", pageParam, 25),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : null,
    enabled: username !== null,
  });

  const btnText = useLoadMoreText({
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  });

  if (query.error) {
    return (
      <AppMessage
        errorMessage="Something went wrong"
        className="my-16"
        showBackButton={false}
      />
    );
  }

  if (query.data) {
    const pages = query.data.pages;
    const isEmpty = pages[0].data.favorites.length === 0;
    const flatten = pages.flatMap((p) => p.data.favorites);

    if (isEmpty) {
      return (
        <AppMessage
          emptyMessage="No favorites"
          showBackButton={false}
          className="my-16"
        />
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {flatten.map((favorite) => (
            <Link to={`/p/${favorite.poiId}`} key={favorite.poiId}>
              <FavoriteCard favorite={favorite} />
            </Link>
          ))}
        </div>
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
      </>
    );
  }

  return (
    <LoaderCircleIcon className="my-16 mx-auto size-8 text-primary animate-spin" />
  );
}
