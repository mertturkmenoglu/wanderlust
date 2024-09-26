import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import { Button } from "~/components/ui/button";
import { getPoiById } from "~/lib/api";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");

  const poi = await getPoiById(params.id);
  return json({ poi: poi.data });
}

export default function Page() {
  const { poi } = useLoaderData<typeof loader>();

  return (
    <div>
      <BackLink
        href="/dashboard/pois"
        text="Go back to point of interests page"
      />
      <div className="flex items-end gap-4">
        <h2 className="text-4xl font-bold mt-8">{poi.name}</h2>
        <Button variant="link" className="px-0" asChild>
          <Link to={`/dashboard/pois/${poi.id}/edit`}>Edit</Link>
        </Button>
      </div>

      <div className="flex gap-2 mt-4">
        <div className="font-semibold">Poi Id:</div>
        <div>{poi.id}</div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <div className="font-semibold">All Details:</div>
        <pre className="max-w-3xl break-words flex-wrap text-wrap whitespace-pre-wrap">
          {JSON.stringify(poi, null, 2)}
        </pre>
      </div>
    </div>
  );
}
