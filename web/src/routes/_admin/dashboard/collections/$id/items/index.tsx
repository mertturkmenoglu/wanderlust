import AppMessage from '@/components/blocks/app-message';
import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import PoiCard from '@/components/blocks/poi-card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';
import { GripVerticalIcon, LinkIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { utils } from 'swapy';
import AddItemDialog from './-add-item-dialog';
import DeleteItemDialog from './-delete-item-dialog';

export const Route = createFileRoute(
  '/_admin/dashboard/collections/$id/items/',
)({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/collections/{id}', {
        params: {
          path: {
            id: params.id,
          },
        },
      }),
    );
  },
});

function RouteComponent() {
  const { collection } = Route.useLoaderData();
  const { items, id, name } = collection;
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [slotItemMap, setSlotItemMap] = useState(
    utils.initSlotItemMap(items, 'poiId'),
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const mutation = api.useMutation('patch', '/api/v2/collections/{id}/items', {
    onSuccess: async () => {
      toast.success('Collection items updated');
      setIsEditMode(false);
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  // useEffect(() => {
  //   if (!isEditMode) {
  //     return;
  //   }

  //   if (!containerRef.current) {
  //     return;
  //   }

  //   const swapy = createSwapy(containerRef.current, {
  //     swapMode: 'drop',
  //     autoScrollOnDrag: true,
  //   });

  //   swapy.onSwapEnd(({ slotItemMap }) => {
  //     setArr(data.array);
  //   });

  //   return () => {
  //     swapy.destroy();
  //   };
  // }, [isEditMode]);

  return (
    <>
      <DashboardBreadcrumb
        items={[
          { name: 'Collections', href: '/dashboard/collections' },
          {
            name: collection.name,
            href: `/dashboard/collections/${collection.id}`,
          },
          {
            name: 'Items',
            href: `/dashboard/collections/${collection.id}/items`,
          },
        ]}
      />

      <Separator className="my-2" />

      <div className="flex flex-row gap-2 w-min items-start mt-4">
        {!isEditMode && (
          <>
            <AddItemDialog
              collectionId={id}
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
                  params: {
                    path: {
                      id,
                    },
                  },
                  body: {
                    newOrder: slotItemMap.map((el) => ({
                      listIndex: +el.slot + 1,
                      poiId: el.item!,
                    })),
                  },
                });
              }}
            >
              Save
            </Button>
          </>
        )}
      </div>

      <div
        className={cn('grid grid-cols-1 gap-4 mt-4', {
          'grid-cols-5': isEditMode,
          'md:grid-cols-3': !isEditMode,
        })}
        ref={containerRef}
      >
        {items.map((item, i) => (
          <div
            key={item.poiId}
            className="flex flex-col gap-2"
            data-swapy-slot={`${i}`}
          >
            <div data-swapy-item={item.poiId}>
              {!isEditMode && (
                <Link
                  to="/p/$id"
                  params={{
                    id: item.poiId,
                  }}
                >
                  <PoiCard
                    poi={{
                      ...item.poi,
                      image: {
                        alt: item.poi.media[0]?.alt ?? '',
                        url: item.poi.media[0]?.url ?? '',
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
                        alt: item.poi.media[0]?.alt ?? '',
                        url: item.poi.media[0]?.url ?? '',
                      },
                    }}
                  />
                </div>
              )}

              {!isEditMode && (
                <div className="flex flex-row gap-2">
                  <DeleteItemDialog
                    collectionId={id}
                    poiName={item.poi.name}
                    index={i}
                  />

                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={async () => {
                      await window.navigator.clipboard.writeText(
                        new URL(
                          `/p/${item.poiId}`,
                          window.location.origin,
                        ).toString(),
                      );
                      toast.success('Link copied to clipboard');
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
