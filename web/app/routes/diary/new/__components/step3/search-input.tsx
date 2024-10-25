import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { Input } from "~/components/ui/input";
import { FormType } from "../../hooks";

type Props = {
  form: FormType;
};

export default function SearchInput({ form }: Props) {
  return (
    <div className="flex flex-col mx-auto group">
      <label htmlFor="friend-search" className="sr-only">
        Search your friends
      </label>
      <div className="relative">
        <div className="absolute top-1.5 text-muted-foreground left-4 group-focus:text-foreground">
          @
        </div>
        <Input
          placeholder="john_doe"
          className="rounded-full pl-8"
          spellCheck={false}
          autoComplete="off"
          {...form.register("friendSearch")}
        />
        <InputInfo text="Search for your friends by their handle" />
        <InputError error={form.formState.errors.friendSearch} />
      </div>
    </div>
  );
}
