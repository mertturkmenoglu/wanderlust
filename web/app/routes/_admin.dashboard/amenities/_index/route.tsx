import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { getAmenities } from "~/lib/api";
import type { Route } from "./+types/route";

export async function loader() {
  const amenities = await getAmenities();
  return { amenities: amenities.data.amenities };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { amenities } = loaderData;

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">Amenities</h2>
      <div className="grid grid-cols-4 gap-4 mt-8">
        {amenities.map((amenity) => (
          <Link to={`/dashboard/amenities/${amenity.id}`} key={amenity.id}>
            <Button asChild variant="link" className="p-0">
              <div className="font-bold">{amenity.name}</div>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
