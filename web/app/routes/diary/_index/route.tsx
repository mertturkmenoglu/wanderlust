import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
import { BookMarkedIcon, GlobeIcon, LockIcon, PlusIcon } from "lucide-react";
import AppMessage from "~/components/blocks/app-message";
import { buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { listDiaryEntries } from "~/lib/api";
import { getCookiesFromRequest } from "~/lib/cookies";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const Cookie = getCookiesFromRequest(request);
    const res = await listDiaryEntries({ headers: { Cookie } });

    return json({ entries: res.data.entries });
  } catch (e) {
    throw redirect("/");
  }
}

export function meta() {
  return [
    {
      title: "Diary | Wanderlust",
    },
  ];
}

export default function Page() {
  const { entries } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto my-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookMarkedIcon className="size-8 text-primary " />
          <h2 className="text-2xl">My Diary</h2>
        </div>
        <Link
          to="/diary/new"
          className={cn(
            "flex items-center gap-2",
            buttonVariants({ variant: "default" })
          )}
        >
          <PlusIcon className="size-4" />
          <div>New Entry</div>
        </Link>
      </div>

      <Separator className="my-4" />

      <div>
        {entries.length === 0 ? (
          <AppMessage
            emptyMessage="You have no diary entries yet"
            className="my-16"
            showBackButton={false}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {entries.map((entry) => (
              <Link to={`/diary/${entry.id}`} key={entry.id} className="block">
                <div className="flex items-center gap-4">
                  <div>
                    {entry.shareWithFriends ? (
                      <GlobeIcon className="size-4" />
                    ) : (
                      <LockIcon className="size-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-primary hover:underline">
                      {entry.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        dateStyle: "medium",
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
