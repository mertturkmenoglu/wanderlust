import { useDebouncedValue } from '@tanstack/react-pacer';
import { useEffect } from 'react';
import z from 'zod';
import { useLocalStorage } from '@/hooks/use-localstorage';
import type { TSearchCityHit, TSearchHit, TSearchUserHit } from '@/lib/search';
import { usePreferencesStore } from '@/stores/preferences-context';
import { useSearchContext } from './context';

export const searchTypeKey = 'wl-search-type';

export type TSearchType = 'places' | 'cities' | 'users';

export function useSearchType() {
	return useLocalStorage<TSearchType>(searchTypeKey, 'places', {
		deserializer: (str) => {
			if (str === '"places"' || str === '"cities"' || str === '"users"') {
				return str.slice(1, -1) as TSearchType;
			}

			return 'places';
		},
	});
}

const recentSearchesKey = 'wl-recent-searches';

const recentSearchesSchema = z.object({
	places: z.array(z.string()),
	cities: z.array(z.string()),
	users: z.array(z.string()),
});

export type TRecentSearches = z.infer<typeof recentSearchesSchema>;

export function useRecentSearches() {
	return useLocalStorage<TRecentSearches>(
		recentSearchesKey,
		{
			cities: [],
			places: [],
			users: [],
		},
		{
			deserializer: (str) => {
				try {
					const parsed = recentSearchesSchema.parse(JSON.parse(str));

					return parsed;
				} catch {}

				return {
					cities: [],
					places: [],
					users: [],
				};
			},
		},
	);
}

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
