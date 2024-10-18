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
      <input
        id="date"
        type="date"
        className={cn("flex bg-transparent text-base ml-auto mt-4")}
        placeholder="Select the date"
        {...form.register("date", { valueAsDate: true })}
      />
      <InputError error={form.formState.errors.date} />

      <textarea
        id="description"
        className={cn(
          "flex w-full border-b border-input bg-transparent py-1 text-base mt-4 px-1 leading-6 min-h-60 [field-sizing:content] max-h-[45rem]"
        )}
        placeholder="Describe how was your trip"
        autoComplete="off"
        spellCheck={false}
        {...form.register("description")}
      />
      <InputInfo text={lengthTracker(form.watch("description"), 4096)} />
      <InputError error={form.formState.errors.title} />
    </div>
  );
}
