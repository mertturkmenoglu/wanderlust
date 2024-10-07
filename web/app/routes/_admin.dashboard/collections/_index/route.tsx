import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { collectionsCols } from "~/components/blocks/dashboard/columns";
import { DataTable } from "~/components/blocks/dashboard/data-table";
import { Button } from "~/components/ui/button";
import { getCollections } from "~/lib/api-requests";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const Cookie = request.headers.get("Cookie") ?? "";
    const collections = await getCollections(1, 25, { headers: { Cookie } });
    return json({ collections: collections.data.collections });
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

export default function Page() {
  const { collections } = useLoaderData<typeof loader>();

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
