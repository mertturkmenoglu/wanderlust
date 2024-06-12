'use client';

import { Autocomplete } from '@/components/blocks/Autocomplete';
import { useSearchClient } from '@/hooks/useSearchClient';
import { InstantSearch } from 'react-instantsearch';

export default function Search() {
  const searchClient = useSearchClient();
  return (
    <nav className="container mx-auto my-12 flex items-center justify-center space-x-4">
      <InstantSearch
        indexName="locations"
        searchClient={searchClient}
        routing={false}
        insights
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        {/* <CustomSearchBox /> */}

        <Autocomplete />

        {/* <div className="my-8 flex gap-8">
          <RefinementList attribute="tags" />

          <div>
            <Button
              asChild
              variant="link"
              className="cursor-pointer"
            >
              <ClearRefinements />
            </Button>
            <CurrentRefinements />
            <Hits hitComponent={HitComponent} />
          </div>
        </div>
        <Pagination /> */}
      </InstantSearch>
    </nav>
  );
}
