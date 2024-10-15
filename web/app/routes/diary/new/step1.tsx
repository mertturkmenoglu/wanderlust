import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { cn } from "~/lib/utils";
import { FormType } from "./hooks";

type Props = {
  form: FormType;
};

export default function Step1({ form }: Props) {
  return (
    <div className="w-full mt-16 max-w-xl mx-auto">
      <div className="text-lg text-muted-foreground text-center">
        Let's start with giving your entry a title.
      </div>
      <label htmlFor="title" className="mt-16 block">
        Title
      </label>
      <input
        id="title"
        type="text"
        className={cn(
          "flex h-9 w-full border-b border-input bg-transparent py-1 text-lg mt-4"
        )}
        placeholder="My Amazing Trip to Spain"
        {...form.register("title")}
      />
      <InputInfo text="Good titles will help you remember your memories." />
      <InputError error={form.formState.errors.title} />
    </div>
  );
}
