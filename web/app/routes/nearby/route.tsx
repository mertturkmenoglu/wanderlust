import leafletCompatStyles from "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css?url";
import leafletStyles from "leaflet/dist/leaflet.css?url";
import { InstantSearch } from "react-instantsearch";
import { ClientOnly } from "remix-utils/client-only";
import { useGeoSearchClient } from "~/hooks/use-search-client";
import type { Route } from "./+types/route";
import Container from "./components/container.client";

export function links(): Route.LinkDescriptors {
  return [
    { rel: "stylesheet", href: leafletCompatStyles },
    { rel: "stylesheet", href: leafletStyles },
  ];
}

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl my-16">
      <h2 className="font-bold text-2xl">Nearby</h2>
      <ClientOnly fallback={<></>}>{() => <ClientWrapper />}</ClientOnly>
    </div>
  );
}

function ClientWrapper() {
  const searchClient = useGeoSearchClient();

  return (
    <InstantSearch indexName="pois" searchClient={searchClient} routing={true}>
      <Container />
    </InstantSearch>
  );
}
