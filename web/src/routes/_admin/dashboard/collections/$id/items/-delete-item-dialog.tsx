import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  collectionId: string;
  poiName: string;
  index: number;
};

export default function DeleteItemDialog({
  collectionId,
  poiName,
  index,
}: Props) {
  const invalidator = useInvalidator();

  const mutation = api.useMutation(
    'delete',
    '/api/v2/collections/{id}/items/{index}',
    {
      onSuccess: async () => {
        toast.success('Item removed from collection');
        await invalidator.invalidate();
      },
    },
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <TrashIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Remove Item from Collection</DialogTitle>
        </DialogHeader>
        <div className="text-sm">
          <div>
            Are you sure you want to remove this item from the collection?
          </div>
          <div className="mt-2 font-bold">{poiName}</div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={() =>
              mutation.mutate({
                params: {
                  path: {
                    id: collectionId,
                    index,
                  },
                },
              })
            }
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
