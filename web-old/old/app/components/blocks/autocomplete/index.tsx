import { Button } from "@/components/ui/button";
import {
  useAutocomplete,
  UseAutocompleteProps,
} from "@/hooks/use-autocomplete";
import { ipx } from "@/lib/img-proxy";
import CustomSearchBox from "../custom-search-box";
import Card, { AutocompleteItemInfo } from "./card";
import { Link } from "@tanstack/react-router";

type Props = {
  showAdvancedSearch?: boolean;
  showAllResultsButton?: boolean;
  isCardClickable?: boolean;
  onCardClick?: (v: AutocompleteItemInfo) => void;
} & UseAutocompleteProps;

export function Autocomplete({
  showAdvancedSearch = true,
  showAllResultsButton = true,
  isCardClickable = false,
  onCardClick,
  ...props
}: Props) {
  const { indices, currentRefinement } = useAutocomplete(props);
  const hits = indices[0].hits;

  const showDropdown = currentRefinement !== "";
  const isEmptyResult = hits.length === 0;

  return (
    <div className="w-full">
      {showAdvancedSearch && (
        <div className="text-sm leading-none tracking-tight">
          Need more power? Try our{" "}
          <Button variant="link" className="px-0 underline" asChild>
            <Link to="/search">Advanced Search</Link>
          </Button>
        </div>
      )}

      <CustomSearchBox isSearchOnType={true} />

      {showDropdown && (
        <div className="my-2 rounded-lg border border-border">
          {hits.slice(0, 5).map((hit) => (
            <Card
              key={hit.poi.Poi.ID}
              id={hit.poi.Poi.ID}
              image={ipx(hit.poi.Media[0].Url, "w_512")}
              name={hit.poi.Poi.Name}
              categoryName={hit.poi.Category.Name}
              city={hit.poi.City.Name}
              state={hit.poi.City.StateName}
              isCardClickable={isCardClickable}
              onCardClick={onCardClick}
            />
          ))}

          {!isEmptyResult && showAllResultsButton && (
            <Button asChild variant="link">
              <Link to={`/search?locations%5Bquery%5D=${currentRefinement}`}>
                See all results
              </Link>
            </Button>
          )}

          {isEmptyResult && (
            <Button asChild variant="link">
              <Link to="/search">
                No results found. Try our advanced search.
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
