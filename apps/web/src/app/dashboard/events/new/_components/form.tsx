"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { createEventSchema } from "#/routes/dto/create-event";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePickerInput } from "@/components/ui/time-picker/input";
import { createNewLocation } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { DateRange } from "react-day-picker";

type FormInput = z.infer<typeof createEventSchema>;

function NewEventForm() {
  const router = useRouter();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  const [d, setD] = useState<Date | undefined>(undefined);

  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationKey: ["new-event"],
    mutationFn: async (payload: FormInput) => createNewLocation(payload),
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const form = useForm<FormInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      website: null,
      priceLevel: 1,
      accessibilityLevel: 1,
      description: "",
    },
  });

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data);
    //  mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-xl"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name of the event" {...field} />
              </FormControl>
              <FormDescription>Required</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormDescription>Required</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                  value={field.value ?? undefined}
                />
              </FormControl>
              <FormDescription>Optional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Level</FormLabel>
              <FormControl>
                <Input
                  placeholder="1"
                  {...field}
                  type="number"
                  value={`${field.value}`}
                  onChange={(e) => {
                    e.preventDefault();
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
              </FormControl>
              <FormDescription>
                1 is cheap, 5 is expensive (Optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accessibilityLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accessibility Level</FormLabel>
              <FormControl>
                <Input
                  placeholder="5"
                  {...field}
                  type="number"
                  value={`${field.value}`}
                  onChange={(e) => {
                    e.preventDefault();
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
              </FormControl>
              <FormDescription>
                1 is low 5 is highly accessible (Optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel className="block my-2">Date</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
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
            <PopoverContent className="w-auto p-2">
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
        </div>

        <div className="flex items-end gap-2">
          <div className="grid gap-1 text-center">
            <Label htmlFor="hours" className="text-xs">
              Hours
            </Label>
            <TimePickerInput
              picker="hours"
              date={d}
              setDate={setD}
              ref={hourRef}
              onRightFocus={() => minuteRef.current?.focus()}
            />
          </div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="minutes" className="text-xs">
              Minutes
            </Label>
            <TimePickerInput
              picker="minutes"
              date={d}
              setDate={setD}
              ref={minuteRef}
              onLeftFocus={() => hourRef.current?.focus()}
              onRightFocus={() => secondRef.current?.focus()}
            />
          </div>
          <div className="flex h-10 items-center">
            <Clock className="ml-2 h-4 w-4" />
          </div>
        </div>

        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (!d) {
              return;
            }

            console.log({
              hour: d.getHours(),
              mins: d.getMinutes(),
            });
          }}
        >
          Log
        </Button>

        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}

export default NewEventForm;
