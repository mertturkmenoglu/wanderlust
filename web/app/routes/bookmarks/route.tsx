import { LoaderFunctionArgs, redirect } from "react-router";
import { Link } from "react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import AppMessage from "~/components/blocks/app-message";
import { Button } from "~/components/ui/button";
import { getMe, getUserBookmarks } from "~/lib/api";
import BookmarkCard from "./components/bookmark-card";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const Cookie = request.headers.get("Cookie") ?? "";
    const auth = await getMe({ headers: { Cookie } });

    if (!auth.data || auth.data.role !== "admin") {
      throw redirect("/");
    }

    return { isAuthenticated: true }; // I don't know what to return, just returning bool for now.
  } catch (e) {
    throw redirect("/");
  }
}

export function meta() {
  return [{ title: "Bookmarks | Wanderlust" }];
}

export default function Page() {
  const query = useInfiniteQuery({
    queryKey: ["bookmarks"],
    queryFn: ({ pageParam }) => getUserBookmarks(pageParam, 25),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : null,
  });

  return (
    <div className="max-w-7xl mx-auto my-16">
      <h2 className="text-2xl font-bold capitalize tracking-tight">
        Your Bookmarks
      </h2>
      <div className="my-8">
        {query.isLoading && (
          <AppMessage emptyMessage="Loading..." showBackButton={false} />
        )}
        {query.data && query.data.pages[0].data.bookmarks.length === 0 && (
          <AppMessage emptyMessage="You have no bookmarks yet" />
        )}
        {query.data && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {query.data.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.data.bookmarks.map((bookmark) => (
                  <Link
                    to={`/p/${bookmark.poiId}`}
                    key={bookmark.poiId}
                    className="block"
                  >
                    <BookmarkCard bookmark={bookmark} />
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
    </div>
  );
}
