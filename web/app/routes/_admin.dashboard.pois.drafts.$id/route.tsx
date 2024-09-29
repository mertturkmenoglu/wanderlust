import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import { getDraft } from "~/lib/api-requests";
import DeleteDialog from "./delete-dialog";

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");

  try {
    const Cookie = request.headers.get("Cookie") ?? "";
    const draft = await getDraft(params.id, { headers: { Cookie } });
    return json({ draft: draft.data });
  } catch (e) {
    throw new Response("Something went wrong", { status: 500 });
  }
}
export default function Page() {
  const { draft } = useLoaderData<typeof loader>();

  return (
    <div>
      <BackLink href="/dashboard/pois/drafts" text="Go back to drafts page" />
      <div className="flex items-end gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Draft</h2>
        <DeleteDialog id={draft.id} />
      </div>

      <pre className="mt-8">{JSON.stringify(draft, null, 2)}</pre>
    </div>
  );
}
