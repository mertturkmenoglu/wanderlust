import Link from "next/link";
import { Point, eventCols, pointCols } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export const points: Point[] = [
  {
    id: "728ed52f",
    name: "Location 1",
    categoryId: 1,
  },
  {
    id: "489e1d42",
    name: "Location 1",
    categoryId: 2,
  },
];

function Page() {
  return (
    <div>
      <div>
        <h3 className="text-lg font-bold tracking-tight my-4">Points</h3>
        <DataTable columns={pointCols} data={points} />
        <Link href="/dashboard/points/new" className="mt-4 block">
          Create new point
        </Link>
      </div>

      <div className="mt-16">
        <h3 className="text-lg font-bold tracking-tight my-4">Events</h3>
        <DataTable columns={eventCols} data={[]} />
        <Link href="/dashboard/events/new" className="mt-4 block">
          Create new event
        </Link>
      </div>
    </div>
  );
}

export default Page;
