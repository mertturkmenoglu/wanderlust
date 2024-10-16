import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { lengthTracker } from "~/lib/form-utils";
import { cn } from "~/lib/utils";
import { FormType } from "./hooks";

type Props = {
  form: FormType;
};

export default function Step3({ form }: Props) {
  return (
    <div className="w-full mt-16 max-w-2xl mx-auto">
      <div className="text-lg text-muted-foreground text-center">
        Now describe your trip in detail.
      </div>
      <label htmlFor="description" className="mt-16 block">
        Description
      </label>
      <textarea
        id="description"
        className={cn(
          "flex w-full border-b border-input bg-transparent py-1 text-base mt-4 px-1 [field-sizing:content]"
        )}
        placeholder="Describe how was your trip"
        autoComplete="off"
        spellCheck={false}
        rows={10}
        {...form.register("description")}
      />
      <InputInfo text={lengthTracker(form.watch("description"), 4096)} />
      <InputError error={form.formState.errors.title} />
    </div>
  );
}
