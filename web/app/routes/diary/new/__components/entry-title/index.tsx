import { CheckIcon, PenIcon, SaveIcon } from "lucide-react";
import { useState } from "react";
import InputError from "~/components/kit/input-error";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { FormType, useSaveToLocalStorage } from "../../hooks";

type Props = {
  className?: string;
  form: FormType;
};

export default function EntryTitle({ className, form }: Props) {
  const title = form.watch("title");
  const displayTitle = title && title !== "" ? title : "New Diary Entry";
  const { saveStatus, saveText, saveToLocalStorage } =
    useSaveToLocalStorage(form);
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
          <h2 className="text-4xl">{displayTitle}</h2>
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

      {form.formState.isDirty && (
        <div className="text-muted-foreground text-xs ml-auto">
          You have unsaved changes.
        </div>
      )}
    </div>
  );
}
