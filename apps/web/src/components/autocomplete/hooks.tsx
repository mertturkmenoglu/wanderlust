import { useDebouncedValue } from '@tanstack/react-pacer';
import { useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-localstorage';
import { useAutocompleteContext } from './context';

const key = 'wl-recent-searches';

export function useRecentSearches() {
	const [values, setValues, clearValues] = useLocalStorage<string[]>(key, []);
	return { values, setValues, clearValues };
}

export function useTrackRecentSearches() {
	const ctx = useAutocompleteContext();
	const searches = useRecentSearches();
	const [debounced] = useDebouncedValue(ctx.autocomplete.currentRefinement, {
		wait: 1000,
	});

	useEffect(() => {
		if (debounced) {
			searches.setValues((prev) => {
				const filtered = prev.filter((item) => item !== debounced);
				return [debounced, ...filtered].slice(0, ctx.recentSearchLimit);
			});
		}
	}, [debounced, searches.setValues, ctx.recentSearchLimit]);
}

export function useHandleClickOutside(
	ref: React.RefObject<HTMLDivElement | null>,
) {
	const ctx = useAutocompleteContext();

	useEffect(() => {
		const handle = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				ctx.setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handle);

		return () => document.removeEventListener('mousedown', handle);
	}, [ctx.setIsDropdownOpen, ref.current]);
}
