import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { cn } from "~/lib/utils";
import { FormType } from "../../hooks";

type Props = {
  form: FormType;
};

export default function SearchInput({ form }: Props) {
  return (
    <div className="flex flex-col gap-4 mx-auto">
      <label htmlFor="friend-search" className="block">
        Search your friends
      </label>
      <div className="relative">
        <div className="absolute top-1.5 text-muted-foreground">@</div>
        <input
          id="friend-search"
          className={cn(
            "flex h-9 w-full border-b border-input bg-transparent py-1 text-base px-1 pl-5"
          )}
          placeholder="john_doe"
          autoComplete="off"
          spellCheck={false}
          {...form.register("friendSearch")}
        />
        <InputInfo text="Search for your friends by their handle" />
        <InputError error={form.formState.errors.friendSearch} />
      </div>
    </div>
  );
}
