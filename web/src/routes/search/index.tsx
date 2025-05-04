import { useSearchClient } from '@/hooks/use-search-client';
import { createFileRoute } from '@tanstack/react-router';
import { InstantSearch } from 'react-instantsearch';
import Container from './-components/container';

export const Route = createFileRoute('/search/')({
  component: RouteComponent,
});

function RouteComponent() {
  const searchClient = useSearchClient();

  return (
    <div className="mx-auto max-w-7xl my-16">
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
    </div>
  );
}
