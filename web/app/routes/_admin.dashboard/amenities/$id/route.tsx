import { Link } from "react-router";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import { Button } from "~/components/ui/button";
import { getAmenities } from "~/lib/api";
import type { Route } from "./+types/route";
import DeleteDialog from "./delete-dialog";

export async function loader({ params }: Route.LoaderArgs) {
  invariant(params.id, "id is required");
  const amenities = await getAmenities();
  const id = +params.id;
  const amenity = amenities.data.amenities.find((amenity) => amenity.id === id);

  if (!amenity) {
    throw new Response("Amenity not found", { status: 404 });
  }

  return { amenity };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { amenity } = loaderData;

  return (
    <div>
      <BackLink href="/dashboard/amenities" text="Go back to amenities page" />
      <div className="flex items-end gap-4">
        <h2 className="text-4xl font-bold mt-8">{amenity.name}</h2>
        <Button variant="link" className="px-0" asChild>
          <Link to={`/dashboard/amenities/${amenity.id}/edit`}>Edit</Link>
        </Button>
        <DeleteDialog id={amenity.id} />
      </div>
      <div className="flex gap-2 mt-4">
        <div className="font-semibold">ID:</div>
        <div>{amenity.id}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">Name:</div>
        <div>{amenity.name}</div>
      </div>
    </div>
  );
}
