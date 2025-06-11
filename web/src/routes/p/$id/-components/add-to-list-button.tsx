import { CreateListDialog } from '@/components/blocks/lists/create-list-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { AuthContext } from '@/providers/auth-provider';
import { getRouteApi } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { useContext, useState } from 'react';
import { toast } from 'sonner';

export function AddToListButton() {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();
  const auth = useContext(AuthContext);
  const [listId, setListId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const query = api.useQuery(
    'get',
    '/api/v2/lists/status/{poiId}',
    {
      params: {
        path: {
          poiId: poi.id,
        },
      },
    },
    {
      enabled: !!auth.user && open,
    },
  );
  const invalidator = useInvalidator();
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  const mutation = api.useMutation('post', '/api/v2/lists/{id}/items', {
    onSuccess: async () => {
      await invalidator.invalidate();
      toast.success('Added to the list');
      setOpen(false);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => setOpen(true)}
              >
                <PlusIcon className={cn('size-6 text-primary')} />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Add to list</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Select a list</DialogTitle>
          <DialogDescription className="w-full">
            {query.data && (
              <Select onValueChange={(v) => setListId(v)}>
                <SelectTrigger className="mt-4 w-full">
                  <SelectValue placeholder="Select a list" />
                </SelectTrigger>
                <SelectContent className="w-full max-h-96">
                  {query.data.statuses.map((listStatus) => (
                    <SelectItem
                      value={listStatus.id}
                      key={listStatus.id}
                      disabled={listStatus.includes}
                      className="break-words"
                    >
                      {listStatus.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:flex sm:justify-between">
          <CreateListDialog
            open={newListDialogOpen}
            setOpen={setNewListDialogOpen}
            onSuccess={async () => {
              toast.success('List created');
              await invalidator.invalidate();
              setNewListDialogOpen(false);
            }}
          >
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                setNewListDialogOpen(true);
              }}
            >
              Create New List
            </Button>
          </CreateListDialog>
          <Button
            type="button"
            variant="default"
            onClick={() => {
              if (!listId) {
                return;
              }
              mutation.mutate({
                params: {
                  path: {
                    id: listId,
                  },
                },
                body: {
                  poiId: poi.id,
                },
              });
            }}
            disabled={listId === null}
          >
            Add to list
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
