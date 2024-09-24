import { json, LoaderFunctionArgs, MetaArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPoiById } from "~/lib/api";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;

  if (!id) {
    throw redirect("/");
  }

  const res = await getPoiById(id);
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
