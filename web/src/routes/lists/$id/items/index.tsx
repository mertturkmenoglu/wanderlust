import BackLink from '@/components/blocks/back-link';
import { Button } from '@/components/ui/button';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { ArrowDownIcon, ArrowUpIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/lists/$id/items/')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.auth.user) {
      throw redirect({
        to: '/',
      });
    }
  },
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/lists/{id}', {
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
  const { list } = Route.useLoaderData();
  const [items, setItems] = useState(list.items);
  const [isDirty, setIsDirty] = useState(false);
  const invalidator = useInvalidator();

  const updateListItemsMutation = api.useMutation(
    'patch',
    '/api/v2/lists/{id}/items',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        setIsDirty(false);
        toast.success('List items updated');
      },
    },
  );

  return (
    <div className="max-w-7xl mx-auto my-8">
      <BackLink
        href={`/lists/${list.id}/edit`}
        text="Go back to the edit list page"
      />
      <div className="grid grid-cols-1 gap-4">
        <div className="col-span-full">
          <Button
            variant="default"
            disabled={!isDirty}
            onClick={() => {
              updateListItemsMutation.mutate({
                params: {
                  path: {
                    id: list.id,
                  },
                },
                body: {
                  poiIds: items.map((item) => item.poiId),
                },
              });
            }}
          >
            Save
          </Button>
        </div>
        {items.map((item, i) => (
          <div
            key={item.poi.id}
            className="flex items-center gap-2"
          >
            <div className={cn('group', 'flex items-center gap-4')}>
              <img
                src={ipx(item.poi.firstMedia.url, 'w_512')}
                alt={item.poi.firstMedia.alt}
                className="aspect-video w-full rounded-md object-cover max-w-36"
              />

              <div className="my-2">
                <div className="mt-2 text-lg font-semibold capitalize">
                  {item.poi.name}
                </div>
              </div>
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="ml-auto"
              onClick={() => {
                setIsDirty(true);
                setItems(items.filter((i) => i.poi.id !== item.poi.id));
              }}
            >
              <span className="sr-only">Remove</span>
              <Trash2Icon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={i === 0}
              onClick={() => {
                setIsDirty(true);
                const newItems = [...items];
                [newItems[i - 1], newItems[i]] = [
                  newItems[i]!,
                  newItems[i - 1]!,
                ];

                setItems([...newItems]);
              }}
            >
              <span className="sr-only">Move Up</span>
              <ArrowUpIcon className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              disabled={i === items.length - 1}
              onClick={() => {
                setIsDirty(true);
                const newItems = [...items];
                const temp = items[i]!;
                newItems[i] = newItems[i + 1]!;
                newItems[i + 1] = temp;

                setItems([...newItems]);
              }}
            >
              <span className="sr-only">Move Down</span>
              <ArrowDownIcon className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
