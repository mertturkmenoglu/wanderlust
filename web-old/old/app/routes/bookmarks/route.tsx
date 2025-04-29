import { queryOptions, useQuery } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { Link, redirect } from "react-router";
import AppMessage from "~/components/blocks/app-message";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { usePageParam } from "~/hooks/use-page-param";
import { usePaginationNumbers } from "~/hooks/use-pagination-numbers";
import { getMe, getUserBookmarks } from "~/lib/api";
import { getCookiesFromRequest } from "~/lib/cookies";
import type { Route } from "./+types/route";
import BookmarkCard from "./components/bookmark-card";

function bookmarksQuery(page: number) {
  return queryOptions({
    queryKey: ["bookmarks", page],
    queryFn: async () => getUserBookmarks(page, 10),
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const auth = await getMe({
      headers: { Cookie: getCookiesFromRequest(request) },
    });

    if (!auth.data) {
      throw redirect("/sign-in");
    }

    // I don't know what to return, just returning bool for now.
    return { isAuthenticated: true };
  } catch (e) {
    throw redirect("/");
  }
}

export function meta(): Route.MetaDescriptors {
  return [{ title: "Bookmarks | Wanderlust" }];
}

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto my-16">
      <h2 className="text-2xl font-bold capitalize tracking-tight">
        Your Bookmarks
      </h2>
      <div className="my-8">
        <Bookmarks />
      </div>
    </div>
  );
}

function Bookmarks() {
  const page = usePageParam();
  const query = useQuery(bookmarksQuery(page));
  const nums = usePaginationNumbers(
    page,
    query.data?.pagination.totalPages ?? 1
  );

  if (query.error) {
    return (
      <AppMessage errorMessage="Something went wrong" showBackButton={false} />
    );
  }

  if (query.data) {
    if (query.data.data.bookmarks.length === 0) {
      return (
        <AppMessage
          emptyMessage="You have no bookmarks."
          showBackButton={false}
        />
      );
    }

    const { data, pagination } = query.data;

    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {data.bookmarks.map((bookmark) => (
          <Link
            to={`/p/${bookmark.poiId}`}
            key={bookmark.poiId}
            className="block"
          >
            <BookmarkCard bookmark={bookmark} />
          </Link>
        ))}

        <div className="mt-4 flex justify-center col-span-full">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  to={`?page=${pagination.hasPrevious ? page - 1 : 1}`}
                />
              </PaginationItem>

              {nums.map((x) => (
                <PaginationItem key={`pagination-${x}`}>
                  <PaginationLink isActive={x === page} to={`?page=${x}`}>
                    {x}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  to={`?page=${pagination.hasNext ? page + 1 : page}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  }

  return (
    <LoaderCircleIcon className="size-8 animate-spin my-16 text-primary mx-auto" />
  );
}
