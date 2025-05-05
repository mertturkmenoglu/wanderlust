import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import invariant from "tiny-invariant";
import AppMessage from "~/components/blocks/app-message";
import { Button } from "~/components/ui/button";
import { getReviewsByUsername } from "~/lib/api-requests";
import { Route } from "./+types/route";
import Card from "./components/card";

export async function loader({ params }: Route.LoaderArgs) {
  invariant(params.username, "username is required");
  return { username: params.username };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { username } = loaderData;
  const query = useInfiniteQuery({
    queryKey: ["reviews", username],
    queryFn: ({ pageParam }) => getReviewsByUsername(username, pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : null,
  });

  const flat = useMemo(() => {
    if (!query.data) {
      return [];
    }

    return query.data.pages.flatMap((p) => p.data.reviews);
  }, [query.data]);

  return (
    <div>
      {query.isLoading && (
        <AppMessage
          emptyMessage="Loading..."
          showBackButton={false}
          className="my-16"
        />
      )}

      {query.data && flat.length === 0 && (
        <AppMessage
          emptyMessage="No reviews yet"
          showBackButton={false}
          className="my-16"
        />
      )}

      {query.data && (
        <div className="grid grid-cols-1 gap-4">
          {flat.map((review, j) => (
            <Card
              key={review.id}
              review={review}
              isLast={j === flat.length - 1}
            />
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
