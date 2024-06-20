'use client';

import { Autocomplete } from '@/components/blocks/Autocomplete';
import { useSearchClient } from '@/hooks/useSearchClient';
import { InstantSearch } from 'react-instantsearch';

export default function Search() {
  const searchClient = useSearchClient();
  return (
    <nav className="mx-auto my-12 flex items-center justify-center space-x-4">
      <InstantSearch
        indexName="locations"
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
