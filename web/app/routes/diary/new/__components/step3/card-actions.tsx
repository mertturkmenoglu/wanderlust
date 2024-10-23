import { ArrowDownIcon, ArrowUpIcon, XIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { FormType } from "../../hooks";
import { FormInput } from "../../schema";

type Props = {
  index: number;
  id: string;
  fullName: string;
  form: FormType;
  friends: FormInput["friends"];
  className?: string;
};

export default function CardActions({
  index,
  id,
  fullName,
  form,
  friends,
  className,
}: Props) {
  return (
    <div className={cn(className)}>
      <button
        className="p-1.5 hover:bg-muted rounded-full disabled:hover:bg-transparent"
        disabled={index === 0}
        onClick={() => moveItemUp(form, friends, id)}
      >
        <ArrowUpIcon className="size-3" />
        <span className="sr-only">Move {fullName} up</span>
      </button>
      <button
        className="p-1.5 hover:bg-muted rounded-full disabled:hover:bg-transparent"
        disabled={index === friends.length - 1}
        onClick={() => moveItemDown(form, friends, id)}
      >
        <ArrowDownIcon className="size-3" />
        <span className="sr-only">Move {fullName} down</span>
      </button>
      <button
        className="p-1.5 hover:bg-muted rounded-full"
        onClick={() => removeItem(form, friends, id)}
      >
        <XIcon className="size-3" />
        <span className="sr-only">Remove {fullName}</span>
      </button>
    </div>
  );
}

function moveItemUp(form: FormType, friends: FormInput["friends"], id: string) {
  const index = friends.findIndex((f) => f.id === id);

  if (index <= 0) {
    return;
  }
  const arr = [...friends];
  const tmp = arr[index - 1];
  arr[index - 1] = arr[index];
  arr[index] = tmp;
  form.setValue("friends", arr);
}

function moveItemDown(
  form: FormType,
  friends: FormInput["friends"],
  id: string
) {
  const index = friends.findIndex((f) => f.id === id);

  if (index >= friends.length - 1 || index === -1) {
    return;
  }

  const arr = [...friends];
  const tmp = arr[index + 1];
  arr[index + 1] = arr[index];
  arr[index] = tmp;
  form.setValue("friends", arr);
}

function removeItem(form: FormType, friends: FormInput["friends"], id: string) {
  const index = friends.findIndex((f) => f.id === id);

  if (index === -1) {
    return;
  }

  const arr = [...friends];
  arr.splice(index, 1);
  form.setValue("friends", arr);
}
