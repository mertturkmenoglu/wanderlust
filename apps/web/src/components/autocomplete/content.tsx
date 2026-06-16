import { useRef } from 'react';
import { CustomSearchBox } from '../custom-search-box';
import { AdvancedSearchLink } from './advanced-search-link';
import { useAutocompleteContext } from './context';
import { Dropdown } from './dropdown';
import { useHandleClickOutside, useTrackRecentSearches } from './hooks';
import type { AutocompleteProps } from './types';

export function Content(props: AutocompleteProps) {
	const ctx = useAutocompleteContext();
	const wrapperRef = useRef<HTMLDivElement>(null);

	useTrackRecentSearches();

	useHandleClickOutside(wrapperRef);

	return (
		<div className="w-full" ref={wrapperRef}>
			{props.showAdvancedSearch && <AdvancedSearchLink />}

			<CustomSearchBox
				isSearchOnType
				onFocus={() => ctx.setIsDropdownOpen(true)}
			/>

			{ctx.isDropdownOpen && <Dropdown />}
		</div>
	);
}
