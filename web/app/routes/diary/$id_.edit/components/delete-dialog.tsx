import { useNavigate } from "@remix-run/react";
import { useMutation } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { deleteDiaryEntry } from "~/lib/api-requests";

type Props = {
  id: string;
};

export default function DeleteDialog({ id }: Props) {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ["delete-diary-entry", id],
    mutationFn: async () => deleteDiaryEntry(id),
    onSuccess: () => {
      toast.success("Diary entry deleted successfully.");
      navigate("/diary");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <TrashIcon className="size-4" />
          <span className="sr-only">Open delete diary entry dialog</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            diary entry and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button asChild variant="destructive">
            <AlertDialogAction onClick={() => mutation.mutate()}>
              Delete
            </AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
