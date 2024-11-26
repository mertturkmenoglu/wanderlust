import { Link, redirect } from "react-router";
import { collectionsCols } from "~/components/blocks/dashboard/columns";
import { DataTable } from "~/components/blocks/dashboard/data-table";
import { Button } from "~/components/ui/button";
import { getCollections } from "~/lib/api-requests";
import { getCookiesFromRequest } from "~/lib/cookies";
import type { Route } from "./+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const collections = await getCollections(1, 25, {
      headers: { Cookie: getCookiesFromRequest(request) },
    });
    return { collections: collections.data.collections };
  } catch (e) {
    throw redirect("/");
  }
}

function shortDescription(str: string) {
  if (str.length > 64) {
    return str.slice(0, 64) + "...";
  }

  return str;
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { collections } = loaderData;

  return (
    <div>
      <div className="flex items-baseline gap-8 mb-8">
        <h3 className="text-lg font-bold tracking-tight">Collections</h3>
        <Button asChild variant="link" className="px-0">
          <Link to="/dashboard/collections/new">New Collection</Link>
        </Button>
      </div>

      <DataTable
        columns={collectionsCols}
        data={collections.map((collection) => ({
          id: collection.id,
          name: collection.name,
          description: shortDescription(collection.description),
          createdAt: new Date(collection.createdAt).toLocaleDateString(),
        }))}
        hrefPrefix="/dashboard/collections"
      />
    </div>
  );
}
