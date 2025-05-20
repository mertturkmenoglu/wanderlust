import AppMessage from '@/components/blocks/app-message';
import BackLink from '@/components/blocks/back-link';
import InputInfo from '@/components/kit/input-info';
import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, fetchClient } from '@/lib/api';
import { cn } from '@/lib/utils';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/lists/$id/edit/')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.auth.user) {
      throw new Error('You are not signed in');
    }
  },
  loader: async ({ params }) => {
    const list = await fetchClient.GET('/api/v2/lists/{id}', {
      params: {
        path: {
          id: params.id,
        },
      },
    });

    if (list.error) {
      if (list.error.status === 404) {
        throw new Error('List not found');
      } else if (list.error.status === 401) {
        throw new Error('You are not signed in');
      } else if (list.error.status === 403) {
        throw new Error('You do not have permission to update this list');
      } else {
        throw new Error('Something went wrong');
      }
    }

    return { list: list.data!.list };
  },
  errorComponent: ({ error }) => {
    return (
      <AppMessage
        errorMessage={error.message}
        className="my-32"
        backLink="/lists"
        backLinkText="Go back to the lists page"
      />
    );
  },
});

function RouteComponent() {
  const { list } = Route.useLoaderData();
  const navigate = useNavigate();
  const [name, setName] = useState(list.name);
  const [isPublic, setIsPublic] = useState(list.isPublic);
  const [isDirty, setIsDirty] = useState(false);
  const isErr = name.length > 128 || name.length < 1;
  const showErr = isDirty && isErr;

  const mutation = api.useMutation('patch', '/api/v2/lists/{id}', {
    onSuccess: () => {
      navigate({
        to: '/lists/$id',
        params: {
          id: list.id,
        },
      });
      toast.success('List updated');
    },
  });

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
      <div>
        <Link
          to="/lists/$id/items"
          params={{
            id: list.id,
          }}
          className={cn('my-4', buttonVariants({ variant: 'outline' }))}
        >
          Edit List Items
        </Link>
        <div className="space-y-4 max-w-xl">
          <div className="w-full">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Name"
              autoComplete="off"
              className="w-full"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsDirty(true);
              }}
            />
            {showErr && (
              <div className="text-sm text-destructive">
                Name length should be between 1 and 128 characters
              </div>
            )}
          </div>

          <div className="w-full">
            <Checkbox
              id="is-public"
              checked={isPublic}
              onCheckedChange={(c) => {
                setIsDirty(true);
                setIsPublic(c === true);
              }}
            />
            <Label
              htmlFor="is-public"
              className="ml-2"
            >
              Public list
            </Label>
            <InputInfo text="If you make your list public, other users can see it." />
          </div>

          <Button
            disabled={!isDirty}
            onClick={() =>
              mutation.mutate({
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
    </div>
  );
}
