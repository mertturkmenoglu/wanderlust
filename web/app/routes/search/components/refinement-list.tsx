import type { RefinementListItem } from "instantsearch.js/es/connectors/refinement-list/connectRefinementList";
import { useMemo } from "react";
import { useRefinementList } from "react-instantsearch";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

type Props = {
  attribute:
    | "poi.Category.Name"
    | "poi.Poi.PriceLevel"
    | "poi.Poi.AccessibilityLevel"
    | "poi.City.StateName"
    | "poi.City.Name"
    | "poi.Amenities.Amenity.Name"
    | "poi.City.CountryName";
  className?: string;
};

type Attribute = Props["attribute"];

function getPriceLevelLabel(x: number): string {
  switch (x) {
    case 1:
      return "1 - Budget-Friendly";
    case 2:
      return "2 - Affordable";
    case 3:
      return "3 - Moderate";
    case 4:
      return "4 - Pricey";
    case 5:
      return "5 - Luxury";
    default:
      return "Unknown";
  }
}

function getAccessibilityLevelLabel(x: number): string {
  switch (x) {
    case 1:
      return "1 - Not Accessible";
    case 2:
      return "2 - Partially Accessible";
    case 3:
      return "3 - Moderately Accessible";
    case 4:
      return "4 - Mostly Accessible";
    case 5:
      return "5 - Fully Accessible";
    default:
      return "Unknown";
  }
}

export default function RefinementList({ attribute, className }: Props) {
  const limit = attribute === "poi.Category.Name" ? 10 : 5;
  const showMoreLimit = attribute === "poi.Category.Name" ? 20 : 10;

  const {
    canToggleShowMore,
    items,
    isShowingMore,
    refine,
    searchForItems,
    toggleShowMore,
  } = useRefinementList({
    attribute,
    limit,
    operator: "or",
    showMore: true,
    showMoreLimit,
    sortBy: ["isRefined", "name:asc", "count:desc"],
  });

  const title = useMemo(() => {
    switch (attribute) {
      case "poi.Category.Name":
        return "Categories";
      case "poi.Poi.PriceLevel":
        return "Price Level";
      case "poi.Poi.AccessibilityLevel":
        return "Accessibility Level";
      case "poi.City.StateName":
        return "States";
      case "poi.City.Name":
        return "Cities";
      case "poi.Amenities.Amenity.Name":
        return "Amenities";
      case "poi.City.CountryName":
        return "Countries";
      default:
        return attribute;
    }
  }, [attribute]);

  const searchPlaceholder = useMemo(() => {
    switch (attribute) {
      case "poi.Category.Name":
        return "Search a category";
      default:
        return attribute;
    }
  }, [attribute]);

  const showInput = useMemo(() => {
    const searchable: Attribute[] = ["poi.Category.Name"];
    return searchable.includes(attribute);
  }, [attribute]);

  const shouldRenderButton = useMemo(() => {
    const dontRenderButton: Attribute[] = [
      "poi.Poi.PriceLevel",
      "poi.Poi.AccessibilityLevel",
    ];
    return !dontRenderButton.includes(attribute);
  }, [attribute]);

  const getLabel = (item: RefinementListItem) => {
    switch (attribute) {
      case "poi.Poi.PriceLevel":
        return getPriceLevelLabel(+item.value);
      case "poi.Poi.AccessibilityLevel":
        return getAccessibilityLevelLabel(+item.value);
      default:
        return item.label;
    }
  };

  return (
    <div className={cn("my-2 flex flex-col items-start", className)}>
      <div className="font-semibold tracking-tight text-left">{title}</div>
      {showInput && (
        <Input
          type="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={512}
          className="my-4"
          onChange={(event) => searchForItems(event.currentTarget.value)}
          placeholder={searchPlaceholder}
        />
      )}
      <ul
        className={cn("space-y-2 w-full", {
          "mt-2": !showInput,
        })}
      >
        {items.map((item) => (
          <li key={item.label} className="w-full">
            <label className="flex items-center w-full">
              <Checkbox
                checked={item.isRefined}
                onCheckedChange={() => refine(item.value)}
              />
              <span className="ml-2 text-sm capitalize line-clamp-1 w-full text-left">
                {getLabel(item)}
              </span>
              <span className="ml-px text-sm text-muted-foreground">
                {" "}
                ({item.count})
              </span>
            </label>
          </li>
        ))}
      </ul>
      {shouldRenderButton && items.length >= limit && (
        <Button
          variant="link"
          onClick={toggleShowMore}
          disabled={!canToggleShowMore}
          className="px-0"
        >
          {isShowingMore ? "Show Less" : "Show More"}
        </Button>
      )}
    </div>
  );
}
