import { LoaderCircleIcon, PenIcon, SaveIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { truncateWithEllipses } from "~/lib/form-utils";
import { UseSaveReturn } from "../../hooks";
import { FormInput } from "../../schema";

type Props = {
  onClickEdit: () => void;
  save: UseSaveReturn;
};

export default function ShowTitle({ onClickEdit, save }: Props) {
  const form = useFormContext<FormInput>();
  const title = form.watch("title");
  const displayTitle = title && title !== "" ? title : "New Diary Entry";
  const shortDisplayTitle = truncateWithEllipses(displayTitle, 32);
  const { saveStatus, saveText, saveToLocalStorage } = save;

  return (
    <>
      <h2
        className="text-lg font-bold md:font-normal md:text-4xl break-all"
        title={displayTitle}
      >
        {shortDisplayTitle}
      </h2>
      <Button variant="ghost" size="icon" onClick={onClickEdit}>
        <span className="sr-only">Edit</span>
        <PenIcon className="size-4" />
      </Button>
      <Button
        onClick={saveToLocalStorage}
        variant="ghost"
        disabled={saveStatus !== "idle"}
      >
        {saveStatus === "saving" ? (
          <LoaderCircleIcon className="size-4 animate-spin" />
        ) : (
          <SaveIcon className="size-4" />
        )}
        <div className="ml-2">{saveText}</div>
      </Button>
    </>
  );
}
