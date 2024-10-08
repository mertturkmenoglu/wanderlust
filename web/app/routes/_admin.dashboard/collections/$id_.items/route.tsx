import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import PoiCard from "~/components/blocks/poi-card";
import { Button } from "~/components/ui/button";
import { getCollectionItems } from "~/lib/api-requests";

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");
  try {
    const Cookie = request.headers.get("Cookie") ?? "";
    const items = await getCollectionItems(params.id, {
      headers: { Cookie },
    });
    return json({ items: items.data.items, collectionId: params.id });
  } catch (e) {
    throw redirect("/");
  }
}

export default function Page() {
  const { items, collectionId } = useLoaderData<typeof loader>();

  return (
    <>
      <BackLink
        href={`/dashboard/collections/${collectionId}`}
        text="Go back to collection details page"
      />

      <h2 className="text-4xl font-bold mt-4">{collectionId} Items</h2>

      <div className="flex flex-row gap-2 w-min items-start mt-4">
        <Button variant="outline" disabled>
          Add
        </Button>

        <Button variant="outline" disabled>
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.listIndex}>
            <PoiCard
              poi={{
                ...item.poi,
                image: {
                  url: item.poi.firstMedia.url,
                  alt: item.poi.firstMedia.alt,
                },
              }}
              className="my-4"
            />
          </div>
        ))}
      </div>
    </>
  );
}
