'use client';

import { useGeoSearchClient } from '@/hooks/useSearchClient';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet/dist/leaflet.css';
import { InstantSearch } from 'react-instantsearch';
import Container from './_components/container';

export default function Page() {
  const searchClient = useGeoSearchClient();
  return (
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
  );
}
