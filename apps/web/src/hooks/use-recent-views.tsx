import z from 'zod';
import { useLocalStorage } from './use-localstorage';

export const key = 'wl-recent-views';

export const schema = z.object({
	id: z.string(),
	name: z.string(),
	image: z.url(),
});

export type TRecentView = z.infer<typeof schema>;

export function useRecentViews() {
	return useLocalStorage<TRecentView[]>(key, [], {
		deserializer: (str) => {
			try {
				const parsed = JSON.parse(str);
				const validated = z.array(schema).parse(parsed);
				return validated;
			} catch {}

			return [];
		},
	});
}
