import z from 'zod';
import { useLocalStorage } from './use-localstorage';

export const recentSearchesKey = 'wl-recent-searches';

export const recentSearchesSchema = z.object({
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
