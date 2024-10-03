import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { ClientOnly } from "remix-utils/client-only";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { loader } from "../../route";
import StepsNavigation from "../steps-navigation";
import { useUpdateDraftMutation } from "../use-update-draft";
import OpenHours from "./open-hours";

export type ShortDayName =
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat"
  | "sun";

export type Day = {
  id: ShortDayName;
  name: string;
  longName: string;
  ariaLabel: string;
};

const allDays: Array<Day> = [
  {
    id: "mon",
    name: "Mon",
    longName: "Monday",
    ariaLabel: "Toggle monday",
  },
  {
    id: "tue",
    name: "Tue",
    longName: "Tuesday",
    ariaLabel: "Toggle tuesday",
  },
  {
    id: "wed",
    name: "Wed",
    longName: "Wednesday",
    ariaLabel: "Toggle wednesday",
  },
  {
    id: "thu",
    name: "Thu",
    longName: "Thursday",
    ariaLabel: "Toggle thursday",
  },
  {
    id: "fri",
    name: "Fri",
    longName: "Friday",
    ariaLabel: "Toggle friday",
  },
  {
    id: "sat",
    name: "Sat",
    longName: "Saturday",
    ariaLabel: "Toggle saturday",
  },
  {
    id: "sun",
    name: "Sun",
    longName: "Sunday",
    ariaLabel: "Toggle sunday",
  },
];

export type TData = {
  days: string[];
  hours: Record<string, { opensAt: string; closesAt: string }>;
};

export default function Step4() {
  const { draft } = useLoaderData<typeof loader>();
  const mutation = useUpdateDraftMutation<TData>(draft, "4");

  const [days, setDays] = useState<Day[]>(() => {
    if (draft.days) {
      return allDays.filter((d) => draft.days.includes(d.id));
    }

    return [];
  });

  const [hours, setHours] = useState<TData["hours"]>(() => {
    return draft.hours ? draft.hours : {};
  });

  return (
    <div>
      <ToggleGroup
        type="multiple"
        className="mt-8"
        defaultValue={days.map((day) => day.id)}
        onValueChange={(v) => {
          setDays([...allDays.filter((d) => v.includes(d.id))]);
        }}
      >
        {allDays.map((day) => (
          <ToggleGroupItem
            key={day.id}
            value={day.id}
            aria-label={day.ariaLabel}
            size={"sm"}
          >
            {day.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="text-center mt-2 text-xs text-muted-foreground">
        Select the days you want to be open
      </div>

      <form
        className="container mt-8 grid grid-cols-1 gap-4 px-0 max-w-5xl mx-auto md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          const tmp: string[] = days.map((day) => day.id);
          mutation.mutate({ days: tmp, hours });
        }}
      >
        <div className="col-span-2">
          <div className="">
            <ClientOnly fallback={<div>Loading...</div>}>
              {() => (
                <div className="grid grid-cols-2 gap-4">
                  {days.map((day) => (
                    <OpenHours
                      key={day.id}
                      day={day}
                      hours={hours}
                      setHours={setHours}
                    />
                  ))}
                </div>
              )}
            </ClientOnly>
          </div>
        </div>

        <StepsNavigation draftId={draft.id} step={4} />
      </form>
    </div>
  );
}
