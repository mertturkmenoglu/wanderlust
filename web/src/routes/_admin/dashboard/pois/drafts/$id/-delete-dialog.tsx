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
import { api } from '@/lib/api';
import { useNavigate } from '@tanstack/react-router';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  id: string;
};

export default function DeleteDialog({ id }: Props) {
  const navigate = useNavigate();

  const mutation = api.useMutation('delete', '/api/v2/pois/drafts/{id}', {
    onSuccess: async () => {
      toast.success('Draft deleted');
      await navigate({
        to: '/dashboard/pois/drafts',
      });
      window.location.reload();
    },
    onError: (err) => {
      toast.error(err.title ?? 'Something went wrong');
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <TrashIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 text-sm">
          Are you sure you want to delete this draft? This action cannot be
          undone and all data will be permanently deleted.
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="destructive"
            onClick={() =>
              mutation.mutate({
                params: {
                  path: {
                    id,
                  },
                },
              })
            }
          >
            Delete
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
