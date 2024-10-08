import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { getAmenities } from "~/lib/api";

export async function loader() {
  const amenities = await getAmenities();
  return json({ amenities: amenities.data.amenities });
}

export default function Page() {
  const { amenities } = useLoaderData<typeof loader>();

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
