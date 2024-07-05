'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  startsAt: z.date(),
  endsAt: z.date(),
  startsAtTime: z.string(),
  endsAtTime: z.string(),
});

type FormInput = z.infer<typeof schema>;

export default function DatesTab() {
  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data);
  };

  const onError: SubmitErrorHandler<FormInput> = (errors) => {
    console.error(errors);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="max-w-4xl space-y-8"
      >
        {/* Start + End Dates */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="startsAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Start date of the event</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endsAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>End date of the event</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Start + End Time */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="startsAtTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starts At Time</FormLabel>
                <FormControl>
                  <Input
                    placeholder="03:00"
                    type="time"
                    {...field}
                    value={field.value ?? undefined}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endsAtTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ends At Time</FormLabel>
                <FormControl>
                  <Input
                    placeholder="08:00"
                    type="time"
                    {...field}
                    value={field.value ?? undefined}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
