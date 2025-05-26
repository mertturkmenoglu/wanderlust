import { useGeoSearchClient } from '@/hooks/use-search-client';
import { createFileRoute } from '@tanstack/react-router';
import { InstantSearch } from 'react-instantsearch';
import Container from './-components/container';

export const Route = createFileRoute('/nearby/')({
  component: RouteComponent,
});

function RouteComponent() {
  const searchClient = useGeoSearchClient();

  return (
    <div className="mx-auto max-w-7xl my-16">
      <h2 className="font-bold text-2xl">Nearby Locations</h2>
      <InstantSearch
        indexName="pois"
        searchClient={searchClient}
        routing={true}
      >
        <Container />
      </InstantSearch>
    </div>
  );
}
