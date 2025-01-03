import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { Link, redirect } from "react-router";
import AppMessage from "~/components/blocks/app-message";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { getMe } from "~/lib/api";
import { getCookiesFromRequest } from "~/lib/cookies";
import type { Route } from "./+types/route";
import EntryCard from "./components/entry-card";
import Header from "./components/header";
import Loading from "./components/loading";
import { useDiaryEntriesQuery, useLoadMoreText } from "./hooks";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const auth = await getMe({
      headers: { Cookie: getCookiesFromRequest(request) },
    });

    if (!auth.data || auth.data.role !== "admin") {
      throw redirect("/");
    }

    return { userId: auth.data.id };
  } catch (e) {
    throw redirect("/");
  }
}

export function meta(): Route.MetaDescriptors {
  return [
    {
      title: "Diary | Wanderlust",
    },
  ];
}

export default function Page() {
  const [date, setDate] = useState<DateRange | undefined>();

  return (
    <div className="max-w-7xl mx-auto my-8">
      <Header date={date} setDate={setDate} />

      <Separator className="my-4" />

      <Layout date={date} />
    </div>
  );
}

type Props = {
  date: DateRange | undefined;
};

function Layout({ date }: Props) {
  const query = useDiaryEntriesQuery(date);
  const isEmpty = query.data && query.data.pages[0].data.entries.length === 0;
  const loadMoreButtonText = useLoadMoreText(query);

  if (query.isPending) {
    return <Loading />;
  }

  if (isEmpty) {
    return (
      <AppMessage
        emptyMessage="You have no entries yet"
        showBackButton={false}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {query.data &&
          query.data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.entries.map((entry) => (
                <Link
                  to={`/diary/${entry.id}`}
                  key={entry.id}
                  className="block"
                >
                  <EntryCard entry={entry} />
                </Link>
              ))}
            </React.Fragment>
          ))}
      </div>

      {query.hasNextPage && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => query.fetchNextPage()}
            disabled={!query.hasNextPage || query.isFetchingNextPage}
          >
            {loadMoreButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}
