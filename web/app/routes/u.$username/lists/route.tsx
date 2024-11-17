import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import invariant from "tiny-invariant";
import AppMessage from "~/components/blocks/app-message";
import { Button } from "~/components/ui/button";
import { getPublicListsOfUser } from "~/lib/api-requests";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.username, "username is required");
  return json({ username: params.username });
}

export default function Page() {
  const { username } = useLoaderData<typeof loader>();
  const query = useInfiniteQuery({
    queryKey: ["public-lists", username],
    queryFn: ({ pageParam }) => getPublicListsOfUser(username, pageParam, 25),
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
      {query.data && query.data.pages[0].data.lists.length === 0 && (
        <AppMessage
          emptyMessage="No lists yet"
          showBackButton={false}
          className="my-16"
        />
      )}
      {query.data && (
        <div className="grid grid-cols-1 gap-4">
          {query.data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.lists.map((list) => (
                <Link to={`/lists/${list.id}`} key={list.id} className="block">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-primary hover:underline">
                        {list.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Created at:{" "}
                        {new Date(list.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
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
