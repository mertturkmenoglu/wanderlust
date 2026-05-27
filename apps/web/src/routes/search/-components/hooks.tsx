import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { orpc } from '@/lib/orpc';

export function useCurrentCategory() {
	const search = useSearch({ from: '/search/' });

	const query = useQuery(
		orpc.categories.list.queryOptions({
			input: {},
			enabled: search.category !== undefined,
		}),
	);

	if (!query.isSuccess) {
		return null;
	}

	if (!search.category) {
		return null;
	}

	const { categories } = query.data;

	const deserialized = search.category
		.split('|')
		.map((x) => x.split('+').join(' '));

	if (deserialized.length !== 1) {
		return null;
	}

	const first = deserialized[0] ?? '';

	const category = categories.find((c) => c.name === first);

	if (!category) {
		return null;
	}

	return category;
}
