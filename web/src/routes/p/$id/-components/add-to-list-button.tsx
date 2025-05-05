import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';

type Props = {
  poiId: string;
  listId: string | null;
};

export default function AddToListButton({ poiId, listId }: Props) {
  const mutation = useAddToList();

  return (
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
            poiId,
          },
        });
      }}
      disabled={listId === null}
    >
      Add to list
    </Button>
  );
}

export function useAddToList() {
  return api.useMutation('post', '/api/v2/lists/{id}/items', {
    onSuccess: () => {
      toast.success('Added to the list');
    },
    onError: () => {
      toast.error('Failed to add to the list');
    },
  });
}
