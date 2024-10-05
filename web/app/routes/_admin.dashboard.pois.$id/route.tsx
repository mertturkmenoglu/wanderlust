import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { getPoiById } from "~/lib/api";
import { ipx } from "~/lib/img-proxy";

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

      <img
        src={ipx(poi.media[0].url, "w_512")}
        alt={poi.media[0].alt}
        className="mt-4 w-64 rounded-md aspect-video object-cover"
      />

      <h2 className="text-4xl font-bold mt-4">{poi.name}</h2>

      <div className="flex flex-row gap-2 w-min items-start mt-4">
        <Button variant="outline" asChild>
          <Link to={`/p/${poi.id}`}>Visit Page</Link>
        </Button>

        <Button variant="outline" asChild>
          <Link to={`/dashboard/pois/${poi.id}/edit`}>Edit</Link>
        </Button>
      </div>

      <Separator className="my-4 max-w-md" />

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
