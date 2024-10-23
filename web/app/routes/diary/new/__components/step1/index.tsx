import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
import { FormType } from "../../hooks";

type Props = {
  form: FormType;
};

export default function Step1({ form }: Props) {
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
      <InputError error={form.formState.errors.title} />
    </div>
  );
}
