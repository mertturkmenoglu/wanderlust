'use client';

import { Address } from '#/db';
import CustomSearchBox from '@/components/blocks/CustomSearchBox';
import { Button } from '@/components/ui/button';
import { useSearchClient } from '@/hooks/useSearchClient';
import { Media } from '@/lib/types';
import 'instantsearch.css/themes/reset.css';
import {
  ClearRefinements,
  CurrentRefinements,
  Hits,
  InstantSearch,
  Pagination,
  RefinementList,
} from 'react-instantsearch';

type Props = {
  hit: {
    id: string;
    name: string;
    media: Media[];
    categoryId: number;
    address: Address;
  };
};

function HitComponent({ hit }: Props) {
  return (
    <div className="my-4 border border-border p-4">
      <div>{hit.name}</div>
    </div>
  );
}

function Page(): React.ReactElement {
  const searchClient = useSearchClient();

  return (
    <main className="container my-16">
      <InstantSearch
        indexName="locations"
        searchClient={searchClient}
        routing={false}
        insights
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <CustomSearchBox />

        <div className="my-8 flex gap-8">
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
        <Pagination />
      </InstantSearch>
    </main>
  );
}

export default Page;
