import { Link, useLoaderData } from "react-router";
import { Grid2X2Icon, MapIcon } from "lucide-react";
import { useState } from "react";
import { ClientOnly } from "remix-utils/client-only";
import PoiCard from "~/components/blocks/poi-card";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { loader } from "../route";
import { Map } from "./map.client";

type DisplayMode = "grid" | "map";

export default function Locations() {
  const { entry } = useLoaderData<typeof loader>();
  const [displayMode, setDisplayMode] = useState<DisplayMode>("grid");

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-xl font-medium">Locations</div>
        <div>
          <ToggleGroup
            type="single"
            value={displayMode}
            onValueChange={(v) => {
              if (v) {
                setDisplayMode(v === "grid" ? v : "map");
              }
            }}
          >
            <ToggleGroupItem value="grid" aria-label="Toggle bold">
              <Grid2X2Icon className="h-4 w-4" />
              <span className="ml-1">Grid</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="map" aria-label="Toggle italic">
              <MapIcon className="h-4 w-4" />
              <span className="ml-1">Map</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {displayMode === "grid" ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entry.locations.map((location) => (
            <Link to={`/p/${location.poi.id}`}>
              <PoiCard
                poi={{
                  ...location.poi,
                  image: location.poi.firstMedia,
                }}
              />
              <div className="mt-4 text-muted-foreground">
                {location.description}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div>
          <ClientOnly
            fallback={<div className="w-full h-[400px] bg-muted mt-4" />}
          >
            {() => <Map locations={entry.locations} />}
          </ClientOnly>
        </div>
      )}
    </>
  );
}
