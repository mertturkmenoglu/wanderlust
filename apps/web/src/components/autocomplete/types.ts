import type { UseAutocompleteProps } from "@/hooks/use-autocomplete";
import type { TSearchHit } from "@/lib/search";

export type AutocompleteProps = {
	showAdvancedSearch?: boolean;
	showAllResultsButton?: boolean;
	showRecentSearches?: boolean;
	isCardClickable?: boolean;
	onCardClick?: (v: TSearchHit['place']) => void;
} & UseAutocompleteProps;
