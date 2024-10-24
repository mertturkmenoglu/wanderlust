import { useNavigate } from "@remix-run/react";
import { CheckIcon, PenIcon, SaveIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import InputError from "~/components/kit/input-error";
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
import { cn } from "~/lib/utils";
import { FormType, useSaveToLocalStorage } from "../../hooks";

type Props = {
  className?: string;
};

export default function EntryTitle({ className }: Props) {
  const form = useFormContext<FormInput>();
  const state = useFormState(form);
  const title = form.watch("title");
  const displayTitle = title && title !== "" ? title : "New Diary Entry";
  const shortDisplayTitle = truncateWithEllipses(displayTitle, 32);
  const lsSave = useSaveToLocalStorage(form);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className={cn("flex items-end gap-4", className)}>
      {isEditMode && (
        <>
          <div>
            <input
              type="text"
              className="flex h-9 border-b border-input bg-transparent py-1 text-lg mt-4"
              placeholder="Title"
              autoComplete="off"
              spellCheck={false}
              {...form.register("title")}
            />
            <InputError error={form.formState.errors.title} />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditMode(false)}
          >
            <span className="sr-only">Change title</span>
            <CheckIcon className="size-4 text-primary" />
          </Button>
        </>
      )}

      {!isEditMode && (
        <>
          <h2
            className="text-lg font-bold md:font-normal md:text-4xl break-all"
            title={displayTitle}
          >
            {shortDisplayTitle}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditMode(true)}
          >
            <span className="sr-only">Edit</span>
            <PenIcon className="size-4" />
          </Button>
          <Button
            onClick={saveToLocalStorage}
            variant="ghost"
            disabled={saveStatus !== "idle"}
          >
            <SaveIcon className="size-4" />
            <div className="ml-2">{saveText}</div>
          </Button>
        </>
      )}

      <div className="ml-auto flex gap-2 items-center">
        {form.formState.isDirty && (
          <div className="text-muted-foreground text-xs">
            You have unsaved changes.
          </div>
        )}

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
      </div>
    </div>
  );
}
