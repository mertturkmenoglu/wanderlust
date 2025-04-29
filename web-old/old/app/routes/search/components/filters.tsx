import { XIcon } from "lucide-react";
import { useClearRefinements } from "react-instantsearch";
import { Button } from "~/components/ui/button";
import RefinementList from "./refinement-list";

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

      <RefinementList attribute="poi.Category.Name" />

      <RefinementList attribute="poi.Amenities.Amenity.Name" />

      <RefinementList attribute="poi.Poi.PriceLevel" />

      <RefinementList attribute="poi.Poi.AccessibilityLevel" />

      <RefinementList attribute="poi.City.StateName" />

      <RefinementList attribute="poi.City.Name" />

      <RefinementList attribute="poi.City.CountryName" />
    </>
  );
}
