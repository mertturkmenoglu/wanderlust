import { Link, useLoaderData } from "react-router";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { LoaderCircleIcon } from "lucide-react";
import AppMessage from "~/components/blocks/app-message";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { ipx } from "~/lib/img-proxy";
import { loader } from "../route";

type SearchResponse = {
  found: number;
  hits: Array<{
    document: {
      id: string;
      location: [number, number];
      name: string;
      poi: {
        Amenities: Array<{
          Amenity: {
            ID: number;
            Name: string;
          };
        }>;
        Category: {
          ID: number;
          Name: string;
        };
        City: {
          CountryName: string;
          Name: string;
          StateName: string;
        };
        Media: Array<{
          MediaOrder: number;
          Url: string;
        }>;
        Poi: {
          ID: string;
        };
      };
    };
  }>;
  out_of: number;
  page: number;
};

export default function NearbyPois() {
  const {
    poi: {
      id,
      address: { lat, lng },
    },
    searchApiKey,
    searchApiUrl,
  } = useLoaderData<typeof loader>();

  const query = useQuery({
    queryKey: ["poi-nearby", id],
    queryFn: async () => {
      const sp = new URLSearchParams();
      sp.append("q", "*");
      sp.append("query_by", "name");
      sp.append("filter_by", `location:(${lat},${lng},50 km)`);
      const qs = sp.toString();
      const res = await ky
        .get(`${searchApiUrl}/collections/pois/documents/search?${qs}`, {
          headers: {
            "X-TYPESENSE-API-KEY": searchApiKey,
          },
        })
        .json<SearchResponse>();

      return res;
    },
  });

  if (query.data) {
    return (
      <div className="mt-4 lg:px-8">
        <h3 className="text-2xl font-bold tracking-tight">Nearby Locations</h3>
        <ScrollArea>
          <div className="flex gap-8 my-4">
            {query.data.hits.slice(0, 6).map(({ document: p }) => (
              <Link to={`/p/${p.poi.Poi.ID}`}>
                <div key={p.id} className="group w-[256px]">
                  <img
                    src={ipx(p.poi.Media[0].Url, "w_512")}
                    alt=""
                    className="aspect-video w-full rounded-md object-cover"
                  />

                  <div className="my-2">
                    <div className="mt-2 line-clamp-1 text-lg font-semibold capitalize">
                      {p.name}
                    </div>
                    <div className="line-clamp-1 text-sm text-muted-foreground">
                      {p.poi.City.Name} / {p.poi.City.CountryName}
                    </div>
                  </div>

                  <div>
                    <div className="flex-1 space-y-2">
                      <div className="text-sm text-primary">
                        {p.poi.Category.Name}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="mt-8" />
        </ScrollArea>
      </div>
    );
  }

  if (query.error) {
    return (
      <AppMessage errorMessage="Something went wrong" showBackButton={false} />
    );
  }

  return (
    <div>
      <LoaderCircleIcon className="size-12 text-primary mx-auto animate-spin" />
    </div>
  );
}
