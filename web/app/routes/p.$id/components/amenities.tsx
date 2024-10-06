import { CheckIcon } from "lucide-react";

type Props = {
  amenities: Array<{ id: number; name: string }>;
};

export default function Amenities({ amenities }: Props) {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold tracking-tight">Amenities</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {amenities.map((amenity) => (
          <div key={amenity.id} className="flex items-center gap-2">
            <CheckIcon className="size-4 text-primary" />
            <span className="text-muted-foreground text-sm">
              {amenity.name}
            </span>
          </div>
        ))}
        {amenities.length === 0 && (
          <div className="col-span-full">
            <div className="text-muted-foreground text-sm">
              There are no amenities available for this location.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
