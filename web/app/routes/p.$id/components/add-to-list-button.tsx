import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { createListItem } from "~/lib/api";

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
        mutation.mutate({ poiId, listId });
      }}
      disabled={listId === null}
    >
      Add to list
    </Button>
  );
}

type Data = {
  poiId: string;
  listId: string;
};

export function useAddToList() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["add-to-list"],
    mutationFn: async ({ poiId, listId }: Data) =>
      createListItem(listId, poiId),
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: ["my-lists-info"],
      });
      toast.success("Added to the list");
    },
    onError: (e) => {
      toast.error(`Cannot add to the list: ${e.message}`);
    },
  });

  return mutation;
}
