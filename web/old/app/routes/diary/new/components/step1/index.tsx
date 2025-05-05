import { compareAsc, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useFormContext, useFormState } from "react-hook-form";
import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Textarea } from "~/components/ui/textarea";
import { lengthTracker } from "~/lib/form-utils";
import { cn } from "~/lib/utils";
import { FormInput } from "../../schema";
import DeleteDialog from "./delete-dialog";

export default function Step1() {
  const form = useFormContext<FormInput>();
  const state = useFormState(form);
  const date = form.watch("date");

  return (
    <div className="mt-4 flex flex-col">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="My trip to Spain"
          {...form.register("title")}
        />
      </div>

      <div className="flex flex-col mt-4">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] text-left font-normal mt-2",
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
      </div>

      <div className="mt-4">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your trip"
          className="text-base leading-6 min-h-60 [field-sizing:content] max-h-[45rem]"
          autoComplete="off"
          spellCheck={false}
          {...form.register("description")}
        />
        <InputInfo text={lengthTracker(form.watch("description"), 4096)} />
        <InputError error={state.errors.title} />
      </div>

      <div className="ml-auto">
        <DeleteDialog />
      </div>
    </div>
  );
}
