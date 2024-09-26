import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import { getAmenities } from "~/lib/api";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");
  const id = +params.id;
  const amenities = await getAmenities();
  const amenity = amenities.data.amenities.find((amenity) => amenity.id === id);

  if (!amenity) {
    throw new Response("Amenity not found", { status: 404 });
  }

  return json({ amenity });
}

export default function Page() {
  const { amenity } = useLoaderData<typeof loader>();

  return (
    <div>
      <BackLink
        href={`/dashboard/amenities/${amenity.id}`}
        text="Go back to amenity details"
      />
      <div>This is the edit page for amenty {amenity.id}</div>
      <div>
        <pre className="max-w-xl break-words flex-wrap text-wrap whitespace-pre-wrap">
          {JSON.stringify(amenity, null, 2)}
        </pre>
      </div>
    </div>
  );
}
