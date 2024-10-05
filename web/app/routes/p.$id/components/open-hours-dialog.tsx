import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { GetPoiByIdResponseDto } from "~/lib/dto";

type Props = {
  data: GetPoiByIdResponseDto["openTimes"];
};

function fmt(s: string): string {
  let a = s.split(", ")[1];
  let [h, ampm] = a.split(" ");
  h = h.split(":").splice(0, 2).join(":");
  a = `${h} ${ampm}`;
  return a;
}

function keyToReadableDay(key: string): string {
  switch (key) {
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
      return "";
  }
}

export default function OpenHoursDialog({ data }: Props) {
  const allKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const keys = allKeys.filter((k) => !!data[k]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">See open hours</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg z-50">
        <DialogHeader>
          <DialogTitle>Open Hours</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-2 text-sm">
          {allKeys.map((key) => (
            <div key={key} className="grid grid-cols-2">
              <div className="font-semibold">{keyToReadableDay(key)}</div>
              <div className="text-right">
                {keys.includes(key)
                  ? `${fmt(data[key].opensAt)} - ${fmt(data[key].closesAt)}`
                  : "Closed"}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
