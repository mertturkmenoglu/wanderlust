import { AppMessage } from '@/components/blocks/app-message';
import { BackLink } from '@/components/blocks/back-link';
import { PlaceCard } from '@/components/blocks/place-card';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { AuthContext } from '@/providers/auth-provider';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  EllipsisVerticalIcon,
  FlagIcon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react';
import { useContext } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/lists/$id/')({
  component: RouteComponent,
  loader: ({ context, params }) => {
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
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const isOwner = auth.user?.id === list.userId;
  const invalidator = useInvalidator();

  const deleteMutation = api.useMutation('delete', '/api/v2/lists/{id}', {
    onSuccess: async () => {
      await invalidator.invalidate();
      toast.success('List is deleted.');
      navigate({
        to: '/lists',
      });
    },
  });

  return (
    <div className="max-w-7xl mx-auto my-8">
      <BackLink
        href="/lists"
        text="Go back to lists"
      />
      <div className="flex justify-between items-center gap-8">
        <div>
          <h2 className="text-2xl tracking-tighter">{list.name}</h2>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            <div>Created by: {list.user.fullName}</div>
            <div>{new Date(list.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="text-xs text-muted-foreground mt-1" />
        </div>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
            >
              <EllipsisVerticalIcon className="" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link
                  to="/report"
                  search={{
                    type: 'list',
                    id: list.id,
                  }}
                  className="flex items-center gap-2 w-full"
                >
                  <FlagIcon className="size-3" />
                  <div className="text-sm">Report</div>
                </Link>
              </DropdownMenuItem>

              {isOwner && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      to="/lists/$id/edit"
                      params={{
                        id: list.id,
                      }}
                      className="flex items-center gap-2 w-full"
                    >
                      <PencilIcon className="size-3" />
                      <div className="text-sm">Edit</div>
                    </Link>
                  </DropdownMenuItem>

                  <DialogTrigger asChild>
                    <DropdownMenuItem>
                      <button
                        type="button"
                        className="flex items-center gap-2 w-full text-destructive"
                      >
                        <TrashIcon className="size-3" />
                        <div className="text-sm">Delete</div>
                      </button>
                    </DropdownMenuItem>
                  </DialogTrigger>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2 text-sm">
              Are you sure you want to delete this list? This action cannot be
              undone and all data will be permanently deleted.
            </div>
            <DialogFooter className="">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
                onClick={() =>
                  deleteMutation.mutate({
                    params: {
                      path: {
                        id: list.id,
                      },
                    },
                  })
                }
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="my-2" />

      {list.items.length === 0 && (
        <AppMessage
          emptyMessage="This list is empty"
          className="my-16"
          backLink="/lists"
          backLinkText="Go back to the lists page"
        />
      )}

      {list.items.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {list.items.map((listItem) => (
            <Link
              to="/p/$id"
              params={{
                id: listItem.placeId,
              }}
              key={listItem.placeId}
            >
              <PlaceCard place={listItem.place} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
