import { Button } from '@/components/ui/button';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { toast } from 'sonner';

type Props = {
  poiId: string;
  listId: string | null;
};

export default function AddToListButton({ poiId, listId }: Props) {
  const invalidator = useInvalidator();
  const mutation = api.useMutation('post', '/api/v2/lists/{id}/items', {
    onSuccess: async () => {
      await invalidator.invalidate();
      toast.success('Added to the list');
    },
  });

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
