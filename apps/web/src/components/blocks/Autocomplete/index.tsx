'use client';

import CustomSearchBox from '@/components/blocks/CustomSearchBox';
import { Button } from '@/components/ui/button';
import { UseAutocompleteProps, useAutocomplete } from '@/hooks/useAutocomplete';
import { api, rpc } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Card from './card';

export function Autocomplete(props: UseAutocompleteProps) {
  const { indices, currentRefinement } = useAutocomplete(props);
  const hits = indices[0].hits;
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return rpc(() => api.categories.$get());
    },
    staleTime: 10 * 60 * 1000,
  });

  function getCategoryName(id: number) {
    const category = (query.data?.data ?? []).find(
      (category) => category.id === id
    );
    return category ? category.name : '';
  }

  return (
    <div className="w-full">
      <div className="text-sm leading-none tracking-tight">
        Need more power? Try our{' '}
        <Button
          variant="link"
          className="px-0 underline"
          asChild
        >
          <Link href="/search">Advanced Search</Link>
        </Button>
      </div>
      <CustomSearchBox />

      {currentRefinement !== '' && (
        <div className="my-2 rounded-lg border border-border">
          {hits.slice(0, 5).map((hit) => (
            <Card
              key={hit.id}
              id={hit.id}
              image={hit.media[0].url}
              name={hit.name}
              categoryName={getCategoryName(hit.categoryId)}
              city={hit.address.city}
              state={hit.address.state}
            />
          ))}

          <Button
            asChild
            variant="link"
          >
            <Link href={`/search?locations%5Bquery%5D=${currentRefinement}`}>
              See all results
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
