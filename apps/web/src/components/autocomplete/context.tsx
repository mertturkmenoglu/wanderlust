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
import type { TSearchHit } from '@/lib/search';
import type { AutocompleteProps } from './types';

type State = {
	autocomplete: AutocompleteRenderState;
	isDropdownOpen: boolean;
	setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
	isEmpty: boolean;
	recentSearchLimit: number;
	showAllResultsButton: boolean;
	showResults: boolean;
	showRecentSearches: boolean;
	hits: TSearchHit[];
	isCardClickable: boolean;
	onCardClick?: (v: TSearchHit['place']) => void;
};

export const AutocompleteContext = createContext<State | null>(null);

type Props = PropsWithChildren<{
	props: AutocompleteProps;
}>;

export function AutocompleteContextProvider({
	props: {
		showAdvancedSearch = true,
		showAllResultsButton: showAllResultsButtonProp = true,
		showRecentSearches: showRecentSearchesProp = true,
		isCardClickable = false,
		onCardClick,
		...props
	},
	children,
}: Props) {
	const ac = useAutocomplete(props);
	const hits = (ac.indices[0]?.hits ?? []) as unknown as TSearchHit[];
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const isEmpty = hits.length === 0;
	const showAllResultsButton =
		!isEmpty && ac.currentRefinement !== '' && showAllResultsButtonProp;
	const showResults = ac.currentRefinement !== '' && !isEmpty;
	const showRecentSearches =
		ac.currentRefinement === '' && !isEmpty && showRecentSearchesProp;

	return (
		<AutocompleteContext.Provider
			value={{
				autocomplete: ac,
				isDropdownOpen: isDropdownOpen && showRecentSearches,
				setIsDropdownOpen,
				isEmpty,
				recentSearchLimit: 5,
				showAllResultsButton,
				showResults,
				showRecentSearches,
				hits,
				isCardClickable,
				onCardClick,
			}}
		>
			{children}
		</AutocompleteContext.Provider>
	);
}

export function useAutocompleteContext() {
	const context = useContext(AutocompleteContext);

	if (!context) {
		throw new Error(
			'useAutocompleteContext must be used within a AutocompleteContextProvider',
		);
	}

	return context;
}
