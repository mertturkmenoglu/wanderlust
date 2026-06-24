import type { AutocompleteRenderState } from 'instantsearch.js/es/connectors/autocomplete/connectAutocomplete';
import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useState,
} from 'react';
import { useAutocomplete } from '@/hooks/use-autocomplete';
import { useSearchType } from '@/hooks/use-search-type';
import type { TCityHit, TPlaceHit, TUserHit } from '@/lib/search';

export type TSearchResultType = TPlaceHit | TCityHit | TUserHit;

type State<T extends TSearchResultType> = {
	variant: 'global' | 'local';
	autocomplete: AutocompleteRenderState;
	isDropdownOpen: boolean;
	setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
	isEmpty: boolean;
	recentSearchLimit: number;
	showAllResultsButton: boolean;
	showResults: boolean;
	showRecentSearches: boolean;
	searchType: 'places' | 'cities' | 'users';
	hits: T[];
	onItemClick?: (v: TSearchResultType) => void;
};

export const SearchContext = createContext<State<TSearchResultType> | null>(
	null,
);

export function SearchContextProvider<T extends TSearchResultType>({
	variant,
	children,
	onItemClick,
}: PropsWithChildren<{
	variant: 'global' | 'local';
	onItemClick?: (v: TSearchResultType) => void;
}>) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const ac = useAutocomplete();
	const [searchType] = useSearchType();
	const hits = (ac.indices[0]?.hits ?? []) as unknown as T[];
	const isEmpty = hits.length === 0;
	const showAllResultsButton =
		!isEmpty && ac.currentRefinement !== '' && variant === 'global';
	const showResults = ac.currentRefinement !== '' && !isEmpty;
	const showRecentSearches =
		ac.currentRefinement === '' && !isEmpty && variant === 'global';

	return (
		<SearchContext.Provider
			value={{
				autocomplete: ac,
				isDropdownOpen: isDropdownOpen,
				setIsDropdownOpen,
				isEmpty,
				recentSearchLimit: 5,
				showAllResultsButton,
				showResults,
				showRecentSearches,
				hits,
				searchType,
				variant,
				onItemClick,
			}}
		>
			{children}
		</SearchContext.Provider>
	);
}

export function useSearchContext<T extends TSearchResultType>() {
	const context = useContext(SearchContext);

	if (!context) {
		throw new Error(
			'useSearchContext must be used within a SearchContextProvider',
		);
	}

	return context as State<T>;
}
