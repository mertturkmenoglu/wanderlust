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
import { useDeleteAmenityMutation } from "./hooks";

type Props = {
  id: number;
};

export default function DeleteDialog({ id }: Props) {
  const deleteMutation = useDeleteAmenityMutation(id);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 text-sm">
          Are you sure you want to delete this amenity? This action cannot be
          undone and all data will be permanently deleted.
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
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
