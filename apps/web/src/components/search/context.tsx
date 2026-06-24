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
import type { TSearchCityHit, TSearchHit, TSearchUserHit } from '@/lib/search';
import { useSearchHitsTypeCasted } from './hooks';

type State = {
	autocomplete: AutocompleteRenderState;
	isDropdownOpen: boolean;
	setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
	isEmpty: boolean;
	recentSearchLimit: number;
	showAllResultsButton: boolean;
	showResults: boolean;
	showRecentSearches: boolean;
	searchType: 'places' | 'cities' | 'users';
	hits: TSearchHit[] | TSearchCityHit[] | TSearchUserHit[];
};

export const SearchContext = createContext<State | null>(null);

export function SearchContextProvider({ children }: PropsWithChildren) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const ac = useAutocomplete();
	const [searchType] = useSearchType();
	const unknownHits = (ac.indices[0]?.hits ?? []) as unknown;
	const hits = useSearchHitsTypeCasted(unknownHits);
	const isEmpty = hits.length === 0;
	const showAllResultsButton = !isEmpty && ac.currentRefinement !== '';
	const showResults = ac.currentRefinement !== '' && !isEmpty;
	const showRecentSearches = ac.currentRefinement === '' && !isEmpty;

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
			}}
		>
			{children}
		</SearchContext.Provider>
	);
}

export function useSearchContext() {
	const context = useContext(SearchContext);

	if (!context) {
		throw new Error(
			'useSearchContext must be used within a SearchContextProvider',
		);
	}

	return context;
}
