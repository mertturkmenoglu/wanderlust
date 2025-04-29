import { zodResolver } from "@hookform/resolvers/zod";
import { useLoaderData } from "react-router";
import { compareAsc, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputError from "~/components/kit/input-error";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { loader } from "../route";

const schema = z.object({
  title: z.string().min(1).max(128),
  description: z.string().min(1).max(4096).default("").catch(""),
  shareWithFriends: z.boolean().default(false),
  date: z.coerce.date().default(new Date()),
});

type FormInput = z.infer<typeof schema>;

export default function TabInfo() {
  const { entry } = useLoaderData<typeof loader>();

  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: entry.title,
      description: entry.description,
      date: new Date(entry.date),
      shareWithFriends: entry.shareWithFriends,
    },
  });

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Edit Entry Info</CardTitle>
        <CardDescription>
          You can edit your diary entry content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="">
          <div className="">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              placeholder="Title"
              autoComplete="off"
              {...form.register("title")}
            />
            <InputError error={form.formState.errors.title} />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Label htmlFor="date-select">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] text-left font-normal",
                    !form.watch("date") && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch("date") ? (
                    format(form.watch("date"), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  id="date-select"
                  selected={form.watch("date")}
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
              placeholder="Diary entry description"
              autoComplete="off"
              rows={20}
              {...form.register("description")}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button>Update</Button>
      </CardFooter>
    </Card>
  );
}
