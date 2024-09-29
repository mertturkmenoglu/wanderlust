import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { getDrafts } from "~/lib/api-requests";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const Cookie = request.headers.get("Cookie") ?? "";
    const res = await getDrafts({ headers: { Cookie } });
    return json({ drafts: res.data });
  } catch (e) {
    throw new Response("Something went wrong", { status: 500 });
  }
}

export default function Page() {
  const { drafts } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Drafts</h2>
        <Button asChild variant="link" className="px-0">
          <Link to="/dashboard/pois/drafts/new">New Draft</Link>
        </Button>
      </div>

      <div className="">
        {(drafts ?? []).map((draft) => (
          <Link to={`/dashboard/pois/drafts/${draft.id}`} key={draft.id}>
            <div className="flex flex-col">
              <div className="font-semibold text-primary">
                {draft.name ?? draft.id}
              </div>
              <div className="text-sm text-muted-foreground">
                Version: {draft.v}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
