import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { getCityById } from "~/lib/api";
import DeleteDialog from "./delete-dialog";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");

  const city = await getCityById(params.id);
  return json({ city: city.data });
}

export default function Page() {
  const { city } = useLoaderData<typeof loader>();

  return (
    <>
      <BackLink href="/dashboard/cities" text="Go back to cities page" />

      <img
        src={city.imageUrl}
        alt={city.name}
        className="mt-4 w-64 rounded-md aspect-video object-cover"
      />

      <h2 className="text-4xl font-bold mt-4">{city.name}</h2>

      <div className="flex flex-row gap-2 w-min items-start mt-4">
        <Button variant="outline" asChild>
          <Link to={`/cities/${city.id}/${city.name}`}>Visit Page</Link>
        </Button>

        <Button variant="outline" asChild>
          <Link to={`/dashboard/cities/${city.id}/edit`}>Edit</Link>
        </Button>

        <DeleteDialog id={city.id} />
      </div>

      <Separator className="my-4 max-w-md" />

      <h3 className="mt-4 text-lg font-bold tracking-tight">Short Info</h3>

      <div className="flex gap-2 mt-2">
        <div className="font-semibold">City Id:</div>
        <div>{city.id}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">City Name:</div>
        <div>{city.name}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">State Code:</div>
        <div>{city.stateCode}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">State Name:</div>
        <div>{city.stateName}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">Country Code:</div>
        <div>{city.countryCode}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">Country Name:</div>
        <div>{city.countryName}</div>
      </div>
    </>
  );
}
