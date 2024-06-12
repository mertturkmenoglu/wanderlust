'use client';

import CustomSearchBox from '@/components/blocks/CustomSearchBox';
import { UseAutocompleteProps, useAutocomplete } from '@/hooks/useAutocomplete';
import Card from './card';

export function Autocomplete(props: UseAutocompleteProps) {
  const { indices, currentRefinement } = useAutocomplete(props);
  const hits = indices[0].hits;

  return (
    <div className="w-full">
      <CustomSearchBox />

      {currentRefinement !== '' && (
        <div className="my-2 rounded-lg border border-border">
          {hits.slice(0, 5).map((hit) => (
            <Card
              key={hit.id}
              id={hit.id}
              categoryId={hit.categoryId}
              image={hit.media[0].url}
              name={hit.name}
              tags={hit.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
}
