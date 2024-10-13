import { InstantSearch } from "react-instantsearch";
import { Autocomplete } from "~/components/blocks/autocomplete";
import { useSearchClient } from "~/hooks/use-search-client";

export default function Search() {
  const searchClient = useSearchClient();
  return (
    <nav className="mx-auto my-12 flex items-center justify-center space-x-4">
      <InstantSearch
        indexName="pois"
        searchClient={searchClient}
        routing={false}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <Autocomplete />
      </InstantSearch>
    </nav>
  );
}
