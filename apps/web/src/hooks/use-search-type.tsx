import { useLocalStorage } from './use-localstorage';

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
