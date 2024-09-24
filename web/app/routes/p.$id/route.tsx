import { json, LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { GeneralErrorBoundary } from "~/components/blocks/error-boundary";
import { getPoiById } from "~/lib/api";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");

  const res = await getPoiById(params.id);
  return json({ poi: res.data });
}

export function meta({ data }: MetaArgs<typeof loader>) {
  if (!data) {
    return [{ title: "Poi Not Found " }];
  }

  return [
    { title: `${data.poi.name} | Wanderlust` },
    { name: "description", content: data.poi.description },
  ];
}

export default function Page() {
  const { poi } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto my-16">
      <div>
        <div>This is the poi page</div>
        <pre>{JSON.stringify(poi, null, 2)}</pre>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
