import instantSearchStyles from "instantsearch.css/themes/reset.css?url";
import { LoaderCircleIcon } from "lucide-react";
import { InstantSearch } from "react-instantsearch";
import { ClientOnly } from "remix-utils/client-only";
import { useSearchClient } from "~/hooks/use-search-client";
import type { Route } from "./+types/route";
import Container from "./components/container";

export function links(): Route.LinkDescriptors {
  return [{ rel: "stylesheet", href: instantSearchStyles }];
}

export function meta(): Route.MetaDescriptors {
  return [
    { title: "Search | Wanderlust" },
    {
      name: "description",
      content: "Search Wanderlust",
    },
  ];
}

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl my-16">
      <ClientOnly
        fallback={
          <div>
            <LoaderCircleIcon className="mx-auto size-16 my-16 text-primary animate-spin" />
          </div>
        }
      >
        {() => <ClientWrapper />}
      </ClientOnly>
    </div>
  );
}

function ClientWrapper() {
  const searchClient = useSearchClient();

  return (
    <InstantSearch
      indexName="pois"
      searchClient={searchClient}
      routing={true}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Container />
    </InstantSearch>
  );
}
