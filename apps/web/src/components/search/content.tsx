import { useRef } from 'react';
import { useHandleClickOutside } from '@/hooks/use-handle-click-outside';
import { useSearchContext } from './context';
import { Dropdown } from './dropdown';
import { useTrackRecentSearches } from './hooks';
import { SearchBox } from './search-box';

export function Content() {
	const ctx = useSearchContext();
	const ref = useRef<HTMLDivElement | null>(null);

	useTrackRecentSearches();

	useHandleClickOutside(ref, () => {
		ctx.setIsDropdownOpen(false);
	});

	return (
		<div ref={ref} className="mx-auto w-full max-w-3xl">
			<SearchBox />

			{ctx.isDropdownOpen && <Dropdown />}
		</div>
	);
}
