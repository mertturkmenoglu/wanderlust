import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
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
      <BackLink
        href={`/dashboard/cities/${city.id}`}
        text="Go back to city details"
      />
      <div>This is the edit page for city {city.id}</div>
      <div>
        <pre className="max-w-xl break-words flex-wrap text-wrap whitespace-pre-wrap">
          {JSON.stringify(city, null, 2)}
        </pre>
      </div>
    </div>
  );
}
