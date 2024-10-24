import { compareAsc, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useFormContext, useFormState } from "react-hook-form";
import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { lengthTracker } from "~/lib/form-utils";
import { cn } from "~/lib/utils";
import { FormInput } from "../../schema";

export default function Step1() {
  const form = useFormContext<FormInput>();
  const state = useFormState(form);
  const date = form.watch("date");

  return (
    <div className="w-full mt-8 max-w-xl mx-auto flex flex-col">
      <div className="text-lg text-muted-foreground text-center">
        Select the date
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] text-left font-normal mx-auto mt-2",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            required={true}
            disabled={(d) => {
              const current = new Date();

              // Compare the two dates and return 1 if the first date is after the second,
              // -1 if the first date is before the second or 0 if dates are equal.
              if (compareAsc(d, current) === 1) {
                return true;
              }

              const oldestAllowedDate = new Date("1999-12-31");

              if (compareAsc(d, oldestAllowedDate) === -1) {
                return true;
              }

              return false;
            }}
            onSelect={(d) => form.setValue("date", d ?? new Date())}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="text-lg text-muted-foreground text-center mt-8">
        Describe your trip in detail.
      </div>
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
      <InputError error={state.errors.title} />
    </div>
  );
}
