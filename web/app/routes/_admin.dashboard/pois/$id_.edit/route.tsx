import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import { getPoiById } from "~/lib/api";
import type { Route } from "./+types/route";

export async function loader({ params }: Route.LoaderArgs) {
  invariant(params.id, "id is required");

  const poi = await getPoiById(params.id);
  return { poi: poi.data };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { poi } = loaderData;

  return (
    <div>
      <BackLink
        href={`/dashboard/pois/${poi.id}`}
        text="Go back to point of interest details"
      />
      <div>This is the edit page for point of interest {poi.id}</div>
      <div>
        <pre className="max-w-xl break-words flex-wrap text-wrap whitespace-pre-wrap">
          {JSON.stringify(poi, null, 2)}
        </pre>
      </div>
    </div>
  );
}
