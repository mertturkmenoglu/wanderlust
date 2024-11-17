import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import invariant from "tiny-invariant";
import AppMessage from "~/components/blocks/app-message";
import FormattedRating from "~/components/kit/formatted-rating";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { getReviewsByUsername } from "~/lib/api-requests";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.username, "username is required");
  return json({ username: params.username });
}

export default function Page() {
  const { username } = useLoaderData<typeof loader>();
  const query = useInfiniteQuery({
    queryKey: ["reviews", username],
    queryFn: ({ pageParam }) => getReviewsByUsername(username, pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : null,
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
      {query.data && query.data.pages[0].data.reviews.length === 0 && (
        <AppMessage
          emptyMessage="No reviews yet"
          showBackButton={false}
          className="my-16"
        />
      )}
      {query.data && (
        <div className="grid grid-cols-1 gap-4">
          {query.data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.reviews.map((review) => (
                <Link
                  to={`/p/${review.poiId}`}
                  key={review.id}
                  className="block space-y-4"
                >
                  <div className="flex items-center gap-4 justify-between">
                    <div className="flex items-center">
                      Reviewed{" "}
                      <span className="text-primary mx-4">
                        {review.poi.name}
                      </span>
                      <FormattedRating
                        rating={review.rating}
                        votes={1}
                        showNumbers={false}
                        starsClassName="size-3"
                      />
                      <span className="ml-2 text-sm">
                        {review.rating} stars
                      </span>
                    </div>
                    <span className="">
                      {formatDistanceToNow(review.createdAt)} ago
                    </span>
                  </div>
                  <Separator />
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
