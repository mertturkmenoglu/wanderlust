import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { FormType } from "./hooks";

type Props = {
  form: FormType;
};

export default function Step5({ form }: Props) {
  return (
    <div className="w-full mt-16">
      <div className="text-lg text-muted-foreground text-center">
        Have you had any friends with you? Let's add them to your diary.
      </div>
      <div className="max-w-xl mt-16 mx-auto">
        <div className="flex flex-col gap-4">
          <label htmlFor="friend-search" className="block">
            Search your friends
          </label>
          <input
            id="friend-search"
            className={cn(
              "flex h-9 w-full border-b border-input bg-transparent py-1 text-base px-1"
            )}
            placeholder="@john_doe"
            autoComplete="off"
            spellCheck={false}
            {...form.register("friendSearch")}
          />
          <InputInfo text="Search for your friends by their handle" />
          <InputError error={form.formState.errors.friendSearch} />
        </div>

        <Separator className="my-8" />
      </div>
    </div>
  );
}
