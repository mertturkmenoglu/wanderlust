"use client";

import { getEvents, getLocations } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { eventCols, locationsCols } from "./_components/columns";
import { DataTable } from "./_components/data-table";

function Page() {
  const qLocations = useQuery({
    queryKey: ["locations"],
    queryFn: async () => getLocations(),
  });

  const qEvents = useQuery({
    queryKey: ["events"],
    queryFn: async () => getEvents(),
  });

  return (
    <div>
      <div>
        <h3 className="text-lg font-bold tracking-tight my-4">Points</h3>
        <DataTable columns={locationsCols} data={qLocations.data ?? []} />
        <Link href="/dashboard/locations/new" className="mt-4 block">
          Create new location
        </Link>
      </div>

      <div className="mt-16">
        <h3 className="text-lg font-bold tracking-tight my-4">Events</h3>
        <DataTable columns={eventCols} data={qEvents.data ?? []} />
        <Link href="/dashboard/events/new" className="mt-4 block">
          Create new event
        </Link>
      </div>
    </div>
  );
}

export default Page;
