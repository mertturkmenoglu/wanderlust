import { CheckIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import InputError from "~/components/kit/input-error";
import { Button } from "~/components/ui/button";

type Props = {
  onClick: () => void;
};

export default function EditTitle({ onClick }: Props) {
  const form = useFormContext();
  const titleState = form.getFieldState("title");

  return (
    <div className="flex items-start gap-2">
      <div className="">
        <input
          type="text"
          className="flex h-9 border-b border-input bg-transparent py-1 text-lg"
          placeholder="Title"
          autoComplete="off"
          spellCheck={false}
          {...form.register("title")}
        />
        <InputError error={titleState.error} />
      </div>

      <Button
        variant="ghost"
        size="icon"
        disabled={titleState.invalid}
        onClick={onClick}
      >
        <span className="sr-only">Change title</span>
        <CheckIcon className="size-4 text-primary" />
      </Button>
    </div>
  );
}
