import { Link } from "react-router";
import PoiCard from "~/components/blocks/poi-card";
import { HomeAggregatorPoi } from "~/lib/dto";

type Props = {
  dataKey: "new" | "popular" | "featured" | "favorite";
  data: HomeAggregatorPoi[];
} & Pick<React.ComponentProps<"img">, "fetchPriority" | "loading">;

function getTitle(type: Props["dataKey"]) {
  switch (type) {
    case "new":
      return "New Locations";
    case "popular":
      return "Popular Locations";
    case "featured":
      return "Featured Locations";
    case "favorite":
      return "Favorite Locations";
  }
}

export default function PoiGrid({
  dataKey: key,
  data,
  fetchPriority = "auto",
  loading = "eager",
}: Props) {
  const title = getTitle(key);
  console.log({ key, data });
  const sliced = data.slice(0, 6);
  const isEmpty = sliced.length === 0;

  return (
    <div className="mx-auto">
      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tighter text-accent-foreground">
        {title}
      </h2>

      <div className="my-4 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isEmpty && <div>No data available.</div>}
        {!isEmpty &&
          data.slice(0, 6).map((poi) => (
            <Link key={poi.id} to={`/p/${poi.id}`}>
              <PoiCard
                poi={{
                  ...poi,
                  image: {
                    url: poi.media.url,
                    alt: poi.media.alt,
                  },
                }}
                fetchPriority={fetchPriority}
                loading={loading}
              />
            </Link>
          ))}
      </div>
    </div>
  );
}
