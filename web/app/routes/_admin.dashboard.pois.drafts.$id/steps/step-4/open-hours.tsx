import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Day } from "./index";

type Props = {
  day: Day;
};

export default function OpenHours({ day }: Props) {
  const [openAt, setOpenAt] = useState<Date | null>(null);
  const [closeAt, setCloseAt] = useState<Date | null>(null);

  return (
    <div>
      <div className="text-lg font-semibold tracking-tight">{day.longName}</div>

      <div className="mt-2">
        <div className="grid grid-cols-2 gap-2 max-w-xs">
          <div>Opening At:</div>
          <DatePicker
            selected={openAt}
            onChange={(date) => {
              if (date) {
                console.log("open", date.getHours(), date.getMinutes());
                setOpenAt(date);
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

        <div className="grid grid-cols-2 gap-2 max-w-xs mt-2">
          <div>Closing At:</div>
          <DatePicker
            selected={closeAt}
            onChange={(date) => {
              if (date) {
                setCloseAt(date);
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
