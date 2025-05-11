import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { useClearRefinements } from 'react-instantsearch';
import RefinementList from './refinement-list';

export default function Filters() {
  const { canRefine, refine } = useClearRefinements();

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold tracking-tight underline">
          Filters
        </div>

        <div>
          {canRefine && (
            <Button
              disabled={!canRefine}
              onClick={refine}
              variant="ghost"
              size="sm"
              className=""
            >
              <XIcon className="size-3" />
              <span className="ml-1">Clear</span>
            </Button>
          )}
        </div>
      </div>

      <RefinementList attribute="poi.category.name" />

      {/* <RefinementList attribute="poi.amenities.amenity.name" /> */}

      <RefinementList attribute="poi.priceLevel" />

      <RefinementList attribute="poi.accessibilityLevel" />

      <RefinementList attribute="poi.address.city.state.name" />

      <RefinementList attribute="poi.address.city.name" />

      <RefinementList attribute="poi.address.city.country.name" />
    </>
  );
}
