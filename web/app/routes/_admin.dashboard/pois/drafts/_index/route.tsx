import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { getDrafts } from "~/lib/api-requests";
import { getCookiesFromRequest } from "~/lib/cookies";
import type { Route } from "./+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const res = await getDrafts({
      headers: { Cookie: getCookiesFromRequest(request) },
    });

    return { drafts: res.data };
  } catch (e) {
    throw new Response("Something went wrong", { status: 500 });
  }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { drafts } = loaderData;

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
