import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { BookMarkedIcon, CalendarIcon, XIcon } from 'lucide-react';
import { useDiaryContext } from '../-hooks';
import { CreateDialog } from './create-dialog';

export default function Header() {
  const ctx = useDiaryContext();
  const date = ctx.filterDateRange;
  const setDate = ctx.setFilterDateRange;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-0 items-center justify-between">
      <div className="flex items-center gap-2">
        <BookMarkedIcon className="size-8 text-primary " />
        <h2 className="text-2xl">My Diary</h2>
      </div>

      <div className="flex items-center gap-2">
        {date !== undefined && (
          <button onClick={() => setDate(undefined)}>
            <XIcon className="size-4 text-destructive" />
            <span className="sr-only">Clear date</span>
          </button>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'w-[192px] sm:w-[256px] justify-start text-left font-normal',
                !date && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} -{' '}
                    {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0"
            align="start"
          >
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

        <CreateDialog />
      </div>
    </div>
  );
}
