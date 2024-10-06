import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Day, TData } from "./index";

type Props = {
  day: Day;
  hours: TData["hours"];
  setHours: React.Dispatch<React.SetStateAction<TData["hours"]>>;
};

export default function OpenHours({ day, hours, setHours }: Props) {
  const o = hours[day.id];

  return (
    <div>
      <div className="text-lg font-semibold tracking-tight">{day.longName}</div>

      <div className="mt-2">
        <div className="grid grid-cols-2 gap-2 max-w-xs">
          <div>Opening At:</div>
          <DatePicker
            selected={new Date(o?.opensAt ?? new Date())}
            className="border border-border rounded-md px-2 py-1 disabled:text-muted-foreground"
            onChange={(date) => {
              if (date) {
                setHours((prev) => ({
                  ...prev,
                  [day.id]: {
                    ...prev[day.id],
                    opensAt: date.toLocaleString(),
                  },
                }));
              }
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption="Time"
            dateFormat="h:mm aa"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 max-w-xs mt-2">
          <div>Closing At:</div>
          <DatePicker
            selected={new Date(o?.closesAt ?? new Date())}
            onChange={(date) => {
              if (date) {
                setHours((prev) => ({
                  ...prev,
                  [day.id]: {
                    ...prev[day.id],
                    closesAt: date.toLocaleString(),
                  },
                }));
              }
            }}
            className="border border-border rounded-md px-2 py-1 disabled:text-muted-foreground"
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption="Time"
            dateFormat="h:mm aa"
          />
        </div>
      </div>
    </div>
  );
}
