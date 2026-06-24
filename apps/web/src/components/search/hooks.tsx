import { useDebouncedValue } from '@tanstack/react-pacer';
import { useEffect, useMemo } from 'react';
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
		if (ctx.variant === 'local') {
			return;
		}

		if (!isRecentSearchesEnabled) {
			return;
		}

		if (debounced) {
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
		ctx.variant,
	]);
}

const placePlaceholders = [
	'Find places, attractions, and destinations',
	'Search for a place e.g. Eiffel Tower, Grand Canyon, or Rocky Mountains',
	'Discover new places',
	'Find your next adventure',
	'Search for a location',
	'Explore the world',
	'Discover new destinations',
];

const cityPlaceholders = [
	'Search for a city e.g. Paris, New York, or Tokyo',
	'Find cities to explore',
	'Discover new cities',
	'Search for a city',
	'Explore urban destinations',
];

const userPlaceholders = [
	'Find people to follow',
	'Search for users by name or username',
	'Discover new people',
	'Connect with others',
];

function getRandomElement<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function useInputPlaceholder() {
	const ctx = useSearchContext();
	const [searchType] = useSearchType();

	const memoized = useMemo(() => {
		if (ctx.variant === 'local') {
			return 'Search';
		}

		if (searchType === 'places') {
			return getRandomElement(placePlaceholders);
		}

		if (searchType === 'cities') {
			return getRandomElement(cityPlaceholders);
		}

		if (searchType === 'users') {
			return getRandomElement(userPlaceholders);
		}

		return 'Search';
	}, [ctx.variant, searchType]);

	return memoized;
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
