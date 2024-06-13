'use client';

import { Address } from '#/db';
import Card from '@/components/blocks/Autocomplete/card';
import CustomSearchBox from '@/components/blocks/CustomSearchBox';
import { useCategories } from '@/hooks/use-categories';
import { useSearchClient } from '@/hooks/useSearchClient';
import { Media } from '@/lib/types';
import 'instantsearch.css/themes/reset.css';
import { Hits, InstantSearch } from 'react-instantsearch';
import HitsPerPage from './_components/hits-per-page';
import RefinementList from './_components/refinement-list';
import Pagination from './_components/pagination';

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
    <Card
      id={hit.id}
      categoryName=""
      city={hit.address.city}
      image={hit.media[0].url}
      name={hit.name}
      state={hit.address.state ?? ''}
    />
  );
}

function Page(): React.ReactElement {
  const searchClient = useSearchClient();
  const query = useCategories();

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
        <CustomSearchBox />

        <div className="my-8 flex gap-8">
          <div className="min-w-[256px]">
            <div className="text-lg font-semibold tracking-tight underline">
              Filters
            </div>

            <RefinementList attribute="tags" />

            <RefinementList attribute="address.city" />

            {query.data && (
              <RefinementList
                attribute="categoryId"
                categories={query.data.data}
              />
            )}

            <RefinementList attribute="priceLevel" />

            <RefinementList
              attribute="accessibilityLevel"
              className="mt-4"
            />
          </div>

          <div className="w-full">
            <div className="flex w-full items-center justify-between">
              <div className="text-2xl font-semibold tracking-tight">
                Results
              </div>
              <HitsPerPage />
            </div>
            <hr className="my-2" />
            <Hits hitComponent={HitComponent} />
            <Pagination />
          </div>
        </div>
      </InstantSearch>
    </main>
  );
}

export default Page;
