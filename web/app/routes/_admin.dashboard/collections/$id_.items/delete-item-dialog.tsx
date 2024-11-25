import { useRevalidator } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { deleteCollectionItem } from "~/lib/api-requests";

type Props = {
  collectionId: string;
  poiId: string;
  poiName: string;
};

export default function DeleteItemDialog({
  collectionId,
  poiId,
  poiName,
}: Props) {
  const revalidator = useRevalidator();

  const mutation = useMutation({
    mutationKey: ["collection-item-delete", collectionId, poiId],
    mutationFn: async () => deleteCollectionItem(collectionId, poiId),
    onSuccess: () => {
      toast.success("Item removed from collection");
      revalidator.revalidate();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

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
            onClick={() => mutation.mutate()}
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
