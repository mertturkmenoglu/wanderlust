import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { json, Link } from "@remix-run/react";
import { BookMarkedIcon, PlusIcon } from "lucide-react";
import AppMessage from "~/components/blocks/app-message";
import { buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { getMe } from "~/lib/api";
import { getCookiesFromRequest } from "~/lib/cookies";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const Cookie = getCookiesFromRequest(request);
    const auth = await getMe({ headers: { Cookie } });

    if (!auth.data) {
      throw redirect("/");
    }

    return json({ auth: auth.data });
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
        <AppMessage
          emptyMessage="You have no diary entries yet"
          className="my-16"
          showBackButton={false}
        />
      </div>
    </div>
  );
}
