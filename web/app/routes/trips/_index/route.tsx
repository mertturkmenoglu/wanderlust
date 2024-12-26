import { MailsIcon, MapIcon, SearchIcon, SquarePlusIcon } from "lucide-react";
import { Card } from "~/components/blocks/quick-actions/card";

export default function Page() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <img src="/trip.png" className="size-64" />
      <h2 className="mt-8 text-4xl font-bold text-center">
        Plan your next trip with
        <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-sky-600">
          Wanderlust
        </span>
      </h2>

      <div className="mt-8 grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-4 w-full">
        <Card
          to="/trips/planner"
          Icon={SquarePlusIcon}
          text="Plan a new trip"
        />
        <Card to="/trips/discover" Icon={SearchIcon} text="Discover trips" />
        <Card to="/trips/my-trips" Icon={MapIcon} text="My Trips" />
        <Card to="/trips/invites" Icon={MailsIcon} text="Invites" />
      </div>
    </div>
  );
}
