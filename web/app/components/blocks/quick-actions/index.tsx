import {
  BookMarkedIcon,
  ListIcon,
  MapIcon,
  MapPinHouseIcon,
} from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { AuthContext } from "~/providers/auth-provider";

type Props = {
  to: string;
  Icon: typeof MapIcon;
  text: string;
};

function Card({ to, Icon, text }: Props) {
  return (
    <div className="bg-yellow-400 rounded-md group">
      <Link
        to={to}
        className={cn(
          "bg-slate-50 p-4 rounded-md flex flex-col items-center justify-center gap-4 aspect-[3]",
          "transition duration-200 group-hover:-translate-y-2 group-hover:translate-x-2"
        )}
      >
        <Icon className="size-6" />
        <span className="text-sm">{text}</span>
      </Link>
    </div>
  );
}

export default function QuickActions() {
  const auth = useContext(AuthContext);

  return (
    <div className="my-8">
      <div className="text-4xl">
        Hello{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-sky-600 font-bold">
          {auth.user?.data.fullName ?? ""}
        </span>
      </div>
      <div className="text-base my-2">How can we help you today?</div>

      <div className="grid grid-cols-2 md:grid-cols-4 mt-8 gap-2 md:gap-4">
        <Card to="/trips/planner" Icon={MapIcon} text="Plan a trip" />
        <Card to="/nearby" Icon={MapPinHouseIcon} text="Discover Nearby" />
        <Card to="/diary" Icon={BookMarkedIcon} text="Diary" />
        <Card to="/lists" Icon={ListIcon} text="MyLists" />
      </div>
    </div>
  );
}
