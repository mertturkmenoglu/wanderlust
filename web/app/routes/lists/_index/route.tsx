import { useInfiniteQuery } from "@tanstack/react-query";
import { GlobeIcon, LockIcon } from "lucide-react";
import React from "react";
import { Link, redirect } from "react-router";
import AppMessage from "~/components/blocks/app-message";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { getAllListsOfUser, getMe } from "~/lib/api-requests";
import { getCookiesFromRequest } from "~/lib/cookies";
import type { Route } from "./+types/route";
import CreateListDialog from "./create-list-dialog";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const auth = await getMe({
      headers: { Cookie: getCookiesFromRequest(request) },
    });

    if (!auth.data) {
      throw redirect("/");
    }

    return { auth: true };
  } catch (e) {
    throw redirect("/");
  }
}

export function meta(): Route.MetaDescriptors {
  return [{ title: "Lists | Wanderlust" }];
}

export default function Page() {
  const query = useInfiniteQuery({
    queryKey: ["lists"],
    queryFn: ({ pageParam }) => getAllListsOfUser(pageParam, 25),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : null,
  });

  return (
    <div className="max-w-7xl my-8 mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">My Lists</h2>
        <CreateListDialog />
      </div>

      <Separator className="my-4" />

      {query.isLoading && (
        <AppMessage emptyMessage="Loading..." showBackButton={false} />
      )}
      {query.data && query.data.pages[0].data.lists.length === 0 && (
        <AppMessage emptyMessage="You have no lists yet" />
      )}
      {query.data && (
        <div className="grid grid-cols-1 gap-4">
          {query.data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.lists.map((list) => (
                <Link to={`/lists/${list.id}`} key={list.id} className="block">
                  <div className="flex items-center gap-4">
                    <div>
                      {list.isPublic ? (
                        <GlobeIcon className="size-4" />
                      ) : (
                        <LockIcon className="size-4" />
                      )}
                    </div>
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
