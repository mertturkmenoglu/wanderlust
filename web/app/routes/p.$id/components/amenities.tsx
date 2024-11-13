import { useLoaderData } from "@remix-run/react";
import { CheckIcon } from "lucide-react";
import { loader } from "../route";

export default function Amenities() {
  const {
    poi: { amenities },
  } = useLoaderData<typeof loader>();
  const isEmpty = amenities.length === 0;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold tracking-tight">Amenities</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {isEmpty ? (
          <EmptyState />
        ) : (
          amenities.map(({ id, name }) => <Item key={id} name={name} />)
        )}
      </div>
    </div>
  );
}

function Item({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckIcon className="size-4 text-primary" />
      <span className="text-muted-foreground text-sm">{name}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full">
      <div className="text-muted-foreground text-sm">
        There are no amenities available for this location.
      </div>
    </div>
  );
}
