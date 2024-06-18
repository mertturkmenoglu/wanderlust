'use client';

import { useSearchClient } from '@/hooks/useSearchClient';
import 'instantsearch.css/themes/reset.css';
import { InstantSearch } from 'react-instantsearch';
import Container from './_components/container';

export default function Page() {
  const searchClient = useSearchClient();

  return (
    <main className="container my-16">
      <InstantSearch
        indexName="locations"
        searchClient={searchClient}
        routing={true}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <Container />
      </InstantSearch>
    </main>
  );
}
