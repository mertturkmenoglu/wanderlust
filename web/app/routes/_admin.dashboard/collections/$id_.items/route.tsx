import { LoaderFunctionArgs, redirect } from "react-router";
import { Link, useLoaderData } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { GripVerticalIcon, LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createSwapy, SwapEventArray } from "swapy";
import invariant from "tiny-invariant";
import AppMessage from "~/components/blocks/app-message";
import BackLink from "~/components/blocks/back-link";
import PoiCard from "~/components/blocks/poi-card";
import { Button } from "~/components/ui/button";
import { getCollectionById, updateCollectionItems } from "~/lib/api-requests";
import { UpdateCollectionItemsRequestDto } from "~/lib/dto";
import { cn } from "~/lib/utils";
import AddItemDialog from "./add-item-dialog";
import DeleteItemDialog from "./delete-item-dialog";

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");
  try {
    const Cookie = request.headers.get("Cookie") ?? "";
    const collection = await getCollectionById(params.id, {
      headers: { Cookie },
    });
    return {
      items: collection.data.items,
      collectionId: params.id,
      name: collection.data.name,
    };
  } catch (e) {
    throw redirect("/");
  }
}

export default function Page() {
  const { items, collectionId, name } = useLoaderData<typeof loader>();
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [arr, setArr] = useState<SwapEventArray>([]);

  const mutation = useMutation({
    mutationKey: ["collection-items-update", collectionId],
    mutationFn: async (data: UpdateCollectionItemsRequestDto) =>
      updateCollectionItems(collectionId, data),
    onSuccess: () => {
      toast.success("Collection items updated");
      setIsEditMode(false);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const container = document.querySelector("#items-container")!;
    const swapy = createSwapy(container, {
      swapMode: "stop",
      autoScrollOnDrag: true,
    });

    swapy.onSwapEnd(({ data }) => {
      setArr(data.array);
    });

    return () => {
      swapy.destroy();
    };
  }, [isEditMode]);

  return (
    <>
      <BackLink
        href={`/dashboard/collections/${collectionId}`}
        text="Go back to collection details page"
      />

      <h2 className="text-4xl font-bold mt-4">{name} Items</h2>

      <div className="flex flex-row gap-2 w-min items-start mt-4">
        {!isEditMode && (
          <>
            <AddItemDialog
              collectionId={collectionId}
              open={addItemOpen}
              setOpen={setAddItemOpen}
            />

            <Button variant="outline" onClick={() => setIsEditMode(true)}>
              Edit
            </Button>
          </>
        )}

        {isEditMode && (
          <>
            <Button
              variant="outline"
              onClick={() => {
                window.location.reload();
              }}
            >
              Cancel
            </Button>

            <Button
              variant="default"
              onClick={() => {
                mutation.mutate({
                  newOrder: arr.map((el) => ({
                    listIndex: +el.slotId + 1,
                    poiId: el.itemId!,
                  })),
                });
              }}
            >
              Save
            </Button>
          </>
        )}
      </div>

      <div
        className={cn("grid grid-cols-1 gap-4 mt-4", {
          "grid-cols-5": isEditMode,
          "md:grid-cols-3": !isEditMode,
        })}
        id="items-container"
      >
        {items.map((item, i) => (
          <div
            key={item.poiId}
            className="flex flex-col gap-2"
            data-swapy-slot={`${i}`}
          >
            <div data-swapy-item={item.poiId}>
              {!isEditMode && (
                <Link to={`/p/${item.poiId}`}>
                  <PoiCard
                    poi={{
                      ...item.poi,
                      image: {
                        url: item.poi.firstMedia.url,
                        alt: item.poi.firstMedia.alt,
                      },
                    }}
                  />
                </Link>
              )}

              {isEditMode && (
                <div className="flex flex-row gap-4 items-center">
                  <div className="cursor-grabbing">
                    <GripVerticalIcon className="size-6" />
                  </div>
                  <PoiCard
                    poi={{
                      ...item.poi,
                      image: {
                        url: item.poi.firstMedia.url,
                        alt: item.poi.firstMedia.alt,
                      },
                    }}
                  />
                </div>
              )}

              {!isEditMode && (
                <div className="flex flex-row gap-2">
                  <DeleteItemDialog
                    collectionId={collectionId}
                    poiId={item.poiId}
                    poiName={item.poi.name}
                  />

                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={async () => {
                      await window.navigator.clipboard.writeText(
                        new URL(
                          `/p/${item.poiId}`,
                          window.location.origin
                        ).toString()
                      );
                      toast.success("Link copied to clipboard");
                    }}
                  >
                    <LinkIcon className="size-4" />
                  </Button>
                </div>
              )}
            </div>
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
