import { useNavigate } from "@remix-run/react";
import { TrashIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";

export default function DeleteDialog() {
  const navigate = useNavigate();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <TrashIcon className="size-3" />
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid gap-4 py-2">
          You will loose this draft. Are you sure you want to delete it?
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              localStorage.removeItem("diary-entry");
              navigate("/diary");
            }}
          >
            Delete Draft
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
