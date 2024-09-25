import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import { Button } from "~/components/ui/button";
import { getCityById } from "~/lib/api";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");

  const city = await getCityById(params.id);
  return json({ city: city.data });
}

export default function Page() {
  const { city } = useLoaderData<typeof loader>();

  return (
    <div>
      <BackLink href="/dashboard/cities" text="Go back to cities page" />
      <div className="flex items-end gap-4">
        <h2 className="text-4xl font-bold mt-8">{city.name}</h2>
        <Button variant="link" className="px-0" asChild>
          <Link to={`/dashboard/cities/${city.id}/edit`}>Edit</Link>
        </Button>
      </div>
      <img
        src={city.imageUrl}
        alt={city.name}
        className="mt-8 w-64 rounded-md aspect-video object-cover"
      />

      <div className="flex gap-2 mt-4">
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
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">Image URL:</div>
        <div>{city.imageUrl}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">Latitude:</div>
        <div>{city.latitude}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">Longitude:</div>
        <div>{city.longitude}</div>
      </div>
      <div className="flex gap-2 mt-2 max-w-xl">
        <div className="font-semibold">Description:</div>
        <div className="max-w-xl">{city.description}</div>
      </div>
    </div>
  );
}
