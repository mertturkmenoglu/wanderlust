import { Link } from "@remix-run/react";
import { format } from "date-fns";
import { BookMarkedIcon, CalendarIcon, PlusIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button, buttonVariants } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

type Props = {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
};

export default function Header({ date, setDate }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-0 items-center justify-between">
      <div className="flex items-center gap-2">
        <BookMarkedIcon className="size-8 text-primary " />
        <h2 className="text-2xl">My Diary</h2>
      </div>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[192px] sm:w-[256px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Link
          to="/diary/new"
          className={cn(
            "flex items-center gap-2",
            buttonVariants({ variant: "default" })
          )}
        >
          <PlusIcon className="size-4" />
          <div className="sr-only sm:not-sr-only">New Entry</div>
        </Link>
      </div>
    </div>
  );
}
