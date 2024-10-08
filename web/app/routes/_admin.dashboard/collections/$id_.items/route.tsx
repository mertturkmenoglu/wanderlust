import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";
import AppMessage from "~/components/blocks/app-message";
import BackLink from "~/components/blocks/back-link";
import PoiCard from "~/components/blocks/poi-card";
import { Button } from "~/components/ui/button";
import { getCollectionById } from "~/lib/api-requests";
import AddItemDialog from "./add-item-dialog";
import DeleteItemDialog from "./delete-item-dialog";

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");
  try {
    const Cookie = request.headers.get("Cookie") ?? "";
    const collection = await getCollectionById(params.id, {
      headers: { Cookie },
    });
    return json({
      items: collection.data.items,
      collectionId: params.id,
      name: collection.data.name,
    });
  } catch (e) {
    throw redirect("/");
  }
}

export default function Page() {
  const { items, collectionId, name } = useLoaderData<typeof loader>();
  const [addItemOpen, setAddItemOpen] = useState(false);

  return (
    <>
      <BackLink
        href={`/dashboard/collections/${collectionId}`}
        text="Go back to collection details page"
      />

      <h2 className="text-4xl font-bold mt-4">{name} Items</h2>

      <div className="flex flex-row gap-2 w-min items-start mt-4">
        <AddItemDialog
          collectionId={collectionId}
          open={addItemOpen}
          setOpen={setAddItemOpen}
        />

        <Button variant="outline" disabled>
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {items.map((item) => (
          <div key={item.listIndex} className="flex flex-col gap-4">
            <Link to={`/p/${item.poiId}`}>
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
            </Link>

            <DeleteItemDialog
              collectionId={collectionId}
              poiId={item.poiId}
              poiName={item.poi.name}
            />
          </div>
        ))}
        {items.length === 0 && (
          <AppMessage
            emptyMessage="This collection is empty"
            showBackButton={false}
            className="col-span-full my-8"
          />
        )}
      </div>
    </>
  );
}
