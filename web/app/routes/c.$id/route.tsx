import { LoaderFunctionArgs, MetaArgs } from "react-router";
import { Link, useLoaderData } from "react-router";
import Markdown from "react-markdown";
import invariant from "tiny-invariant";
import AppMessage from "~/components/blocks/app-message";
import PoiCard from "~/components/blocks/poi-card";
import { getCollectionById } from "~/lib/api-requests";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");

  const collection = await getCollectionById(params.id);
  return { collection: collection.data };
}

export function meta({ data }: MetaArgs<typeof loader>) {
  if (!data) {
    return [{ title: "Wanderlust" }];
  }

  return [{ title: `${data.collection.name} | Wanderlust` }];
}

export default function Page() {
  const { collection } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto mt-8 md:mt-16">
      <h2 className="text-4xl font-bold">{collection.name}</h2>
      <Markdown className="prose mt-8">{collection.description}</Markdown>
      {collection.items.length === 0 && (
        <AppMessage
          emptyMessage="There are no items in this collection"
          showBackButton={false}
          className="mt-8"
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        {collection.items.map((item) => (
          <Link to={`/p/${item.poiId}`} key={item.poiId}>
            <PoiCard
              poi={{
                ...item.poi,
                image: item.poi.firstMedia,
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
