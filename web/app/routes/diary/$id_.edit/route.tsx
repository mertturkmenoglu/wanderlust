import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import { Separator } from "~/components/ui/separator";
import { getDiaryEntryById } from "~/lib/api";
import { getCookiesFromRequest } from "~/lib/cookies";
import DeleteDialog from "./components/delete-dialog";

export async function loader({ params, request }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");

  try {
    const Cookie = getCookiesFromRequest(request);
    const res = await getDiaryEntryById(params.id, { headers: { Cookie } });
    const auth = await getMe({ headers: { Cookie } });

    if (auth.data.id !== res.data.userId) {
      throw json("You do not have permissions to edit this diary entry", {
        status: 403,
      });
    }

    return json({ entry: res.data });
  } catch (e) {
    const status = (e as any)?.response?.status;
    if (status === 401 || status === 403) {
      throw json("You do not have permissions to edit this diary entry", {
        status: 403,
      });
    } else if (status === 404) {
      throw json("Diary entry not found", { status: 404 });
    } else {
      throw json("Something went wrong", { status: status ?? 500 });
    }
  }
}

export function meta() {
  return [{ title: "Edit Diary Entry | Wanderlust" }];
}

export default function Page() {
  const { entry } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto container my-8">
      <div className="flex items-center justify-between">
        <div>
          <BackLink href={`/diary/${entry.id}`} text="Go back to the diary" />
          <h2 className="text-2xl tracking-tighter">{entry.title}</h2>
        </div>

        <div>
          <DeleteDialog id={entry.id} />
        </div>
      </div>

      <Separator className="my-2" />

      <div>this is the diary entry edit page</div>
    </div>
  );
}
