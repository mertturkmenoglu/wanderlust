import { useDebouncedValue } from '@tanstack/react-pacer';
import { useEffect } from 'react';
import { useRecentSearches } from '@/hooks/use-recent-searches';
import { useSearchType } from '@/hooks/use-search-type';
import type { TSearchCityHit, TSearchHit, TSearchUserHit } from '@/lib/search';
import { usePreferencesStore } from '@/stores/preferences-context';
import { useSearchContext } from './context';

export function useTrackRecentSearches() {
	const ctx = useSearchContext();
	const [, setSearches] = useRecentSearches();
	const isRecentSearchesEnabled = usePreferencesStore(
		(s) => s.preferences.enableSearchHistory,
	);

	const [debounced] = useDebouncedValue(ctx.autocomplete.currentRefinement, {
		wait: 1000,
	});

	useEffect(() => {
		if (debounced && isRecentSearchesEnabled) {
			setSearches((prev) => {
				const newCities =
					ctx.searchType === 'cities'
						? [debounced, ...prev.cities.filter((s) => s !== debounced)]
						: prev.cities;
				const newPlaces =
					ctx.searchType === 'places'
						? [debounced, ...prev.places.filter((s) => s !== debounced)]
						: prev.places;
				const newUsers =
					ctx.searchType === 'users'
						? [debounced, ...prev.users.filter((s) => s !== debounced)]
						: prev.users;

				return {
					cities: newCities.slice(0, ctx.recentSearchLimit),
					places: newPlaces.slice(0, ctx.recentSearchLimit),
					users: newUsers.slice(0, ctx.recentSearchLimit),
				};
			});
		}
	}, [
		debounced,
		setSearches,
		ctx.recentSearchLimit,
		isRecentSearchesEnabled,
		ctx.searchType,
	]);
}

export function useInputPlaceholder() {
	const [searchType] = useSearchType();

	if (searchType === 'places') {
		return 'Search a place';
	}

	if (searchType === 'cities') {
		return 'Search a city';
	}

	if (searchType === 'users') {
		return 'Search a user';
	}

	return 'Search';
}

export function useSearchHitsTypeCasted(unknownHits: unknown) {
	const [searchType] = useSearchType();

	if (searchType === 'places') {
		return unknownHits as TSearchHit[];
	}

	if (searchType === 'cities') {
		return unknownHits as TSearchCityHit[];
	}

	if (searchType === 'users') {
		return unknownHits as TSearchUserHit[];
	}

	return unknownHits as TSearchHit[];
}
