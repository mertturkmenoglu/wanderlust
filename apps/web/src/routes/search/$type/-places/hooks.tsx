import { useSearch } from '@tanstack/react-router';
import { useCategoriesQuery } from '@/hooks/use-categories';

export function useCurrentCategory() {
	const search = useSearch({ from: '/search/$type/' });

	const query = useCategoriesQuery();

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

	const category = categories.find((c) => c.id === first);

	if (!category) {
		return null;
	}

	return category;
}
