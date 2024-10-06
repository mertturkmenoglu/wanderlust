import { Link, useParams } from "@remix-run/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import AppMessage from "~/components/blocks/app-message";
import { Button } from "~/components/ui/button";
import { getUserFavoritesByUsername } from "~/lib/api-requests";
import FavoriteCard from "./favorite-card";

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

  return (
    <div>
      {query.isLoading && (
        <AppMessage
          emptyMessage="Loading..."
          showBackButton={false}
          className="my-16"
        />
      )}
      {query.data && query.data.pages[0].data.favorites.length === 0 && (
        <AppMessage
          emptyMessage="This user has no favorites yet"
          showBackButton={false}
          className="my-16"
        />
      )}
      {query.data && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {query.data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.favorites.map((favorite) => (
                <Link
                  to={`/p/${favorite.poiId}`}
                  key={favorite.poiId}
                  className="block"
                >
                  <FavoriteCard favorite={favorite} />
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
              ? "Loading more..."
              : query.hasNextPage
              ? "Load More"
              : "Nothing more to load"}
          </Button>
        </div>
      )}
    </div>
  );
}
