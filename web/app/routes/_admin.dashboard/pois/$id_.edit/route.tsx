import { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import { getPoiById } from "~/lib/api";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");
  const poi = await getPoiById(params.id);
  return { poi: poi.data };
}

export default function Page() {
  const { poi } = useLoaderData<typeof loader>();

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
