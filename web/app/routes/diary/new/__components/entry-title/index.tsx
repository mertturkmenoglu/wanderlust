import { useState } from "react";
import { useFormContext, useFormState } from "react-hook-form";
import { cn } from "~/lib/utils";
import { useSaveToLocalStorage } from "../../hooks";
import { FormInput } from "../../schema";
import DeleteDialog from "./delete-dialog";
import EditTitle from "./edit-title";
import ShowTitle from "./show-title";
import UnsavedChanges from "./unsaved-tooltip";

type Props = {
  className?: string;
};

export default function EntryTitle({ className }: Props) {
  const form = useFormContext<FormInput>();
  const state = useFormState(form);
  const lsSave = useSaveToLocalStorage(form);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {isEditMode && (
        <EditTitle
          onClick={() => {
            setIsEditMode(false);
            lsSave.saveToLocalStorage();
          }}
        />
      )}

      {!isEditMode && (
        <ShowTitle onClickEdit={() => setIsEditMode(true)} save={lsSave} />
      )}

      <div className="ml-auto flex gap-2 items-center">
        {state.isDirty && <UnsavedChanges />}
        <DeleteDialog />
      </div>
    </div>
  );
}
