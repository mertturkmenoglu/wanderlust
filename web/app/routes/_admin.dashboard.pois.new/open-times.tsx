import { UseFormReturn } from "react-hook-form";
import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { FormInput } from "./schema";

type Props = {
  day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  form: UseFormReturn<FormInput>;
};

type DayReadable =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

function dayReadable(day: Props["day"]): DayReadable {
  switch (day) {
    case "mon":
      return "Monday";
    case "tue":
      return "Tuesday";
    case "wed":
      return "Wednesday";
    case "thu":
      return "Thursday";
    case "fri":
      return "Friday";
    case "sat":
      return "Saturday";
    case "sun":
      return "Sunday";
    default:
      throw new Error("Invalid day");
  }
}

export default function OpenTimes({ day, form }: Props) {
  const d = dayReadable(day);

  return (
    <>
      <div>
        <Label htmlFor={day + "-open"}>{d} Open</Label>
        <Input
          type="time"
          id={day + "-open"}
          placeholder={d + " Open"}
          autoComplete="off"
          {...form.register(`openTimes.${day}.open`)}
        />
        <InputInfo text={`${d} open time`} />
        <InputError error={form.formState.errors.openTimes?.[day]?.open} />
      </div>

      <div>
        <Label htmlFor={day + "-close"}>{d} Close</Label>
        <Input
          type="time"
          id={day + "-close"}
          placeholder={d + " Close"}
          autoComplete="off"
          {...form.register(`openTimes.${day}.close`)}
        />
        <InputInfo text={`${d} close time`} />
        <InputError error={form.formState.errors.openTimes?.[day]?.close} />
      </div>

      <div className="flex items-center gap-1">
        <Checkbox
          checked={form.watch(`openTimes.${day}.closed`)}
          onCheckedChange={(checked) => {
            return form.setValue(
              `openTimes.${day}.closed`,
              checked === true ? true : false
            );
          }}
        />

        <Label className="font-normal">Closed</Label>
      </div>
    </>
  );
}
