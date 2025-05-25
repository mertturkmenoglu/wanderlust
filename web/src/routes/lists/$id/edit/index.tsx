import AppMessage from '@/components/blocks/app-message';
import BackLink from '@/components/blocks/back-link';
import InputInfo from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowDownIcon, ArrowUpIcon, SaveIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const Route = createFileRoute('/lists/$id/edit/')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.auth.user) {
      throw new Error('You are not signed in');
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
  const invalidator = useInvalidator();

  const [name, setName] = useState(list.name);
  const form = useForm({
    defaultValues: {
      items: list.items,
    },
  });

  const array = useFieldArray({
    control: form.control,
    name: 'items',
  });
  const [isPublic, setIsPublic] = useState(list.isPublic);
  const [isListDirty, setIsListDirty] = useState(false);
  const isErr = name.length > 128 || name.length < 1;
  const showErr = isListDirty && isErr;

  const updateListMutation = api.useMutation('patch', '/api/v2/lists/{id}', {
    onSuccess: async () => {
      await invalidator.invalidate();
      setIsListDirty(false);
      toast.success('List updated');
    },
  });

  const updateListItemsMutation = api.useMutation(
    'patch',
    '/api/v2/lists/{id}/items',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        toast.success('List items updated');
      },
    },
  );

  return (
    <div className="max-w-7xl mx-auto my-8">
      <BackLink
        href={`/lists/${list.id}`}
        text="Go back to the list page"
      />
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl tracking-tighter">Editing: {list.name}</h2>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            <div>Created by: {list.user.fullName}</div>
            <div>{new Date(list.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="space-y-4 max-w-xl">
          <div className="w-full">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Name"
              autoComplete="off"
              className="w-full mt-1"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsListDirty(true);
              }}
            />
            {showErr && (
              <div className="text-sm text-destructive mt-1">
                Name length should be between 1 and 128 characters
              </div>
            )}
          </div>

          <div className="w-full flex items-start gap-2">
            <Checkbox
              id="is-public"
              checked={isPublic}
              onCheckedChange={(c) => {
                setIsListDirty(true);
                setIsPublic(c === true);
              }}
            />
            <div>
              <Label htmlFor="is-public">Public list</Label>
              <InputInfo text="If you make your list public, other users can see it." />
            </div>
          </div>

          <Button
            size="sm"
            disabled={!isListDirty}
            onClick={() =>
              updateListMutation.mutate({
                params: {
                  path: {
                    id: list.id,
                  },
                },
                body: {
                  isPublic,
                  name,
                },
              })
            }
          >
            Update
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="font-bold">List Items</div>
          {form.watch('items').length > 0 && form.formState.isDirty && (
            <div className="flex">
              <Button
                variant="default"
                size="sm"
                className="ml-auto"
                disabled={!form.formState.isDirty}
                onClick={() => {
                  updateListItemsMutation.mutate({
                    params: {
                      path: {
                        id: list.id,
                      },
                    },
                    body: {
                      poiIds: form.getValues('items').map((item) => item.poiId),
                    },
                  });
                }}
              >
                <SaveIcon className="size-4" />
                <span>Save Changes</span>
              </Button>
            </div>
          )}
        </div>
        {form.watch('items').length === 0 && (
          <AppMessage
            emptyMessage="This list is empty"
            className="my-16"
            showBackButton={false}
          />
        )}
        {form.watch('items').map((item, i) => (
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
                array.remove(i);
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
                array.move(i - 1, i);
              }}
            >
              <span className="sr-only">Move Up</span>
              <ArrowUpIcon className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              disabled={i === form.watch('items').length - 1}
              onClick={() => {
                array.move(i, i + 1);
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
