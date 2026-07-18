import { getDb } from '@/lib/common';

export async function getCategoryIds() {
	const db = await getDb();

	const allCategories = await db.query.categories.findMany({
		columns: {
			id: true,
		},
	});

	const categoryIds = allCategories.map((r) => r.id);

	if (categoryIds.length === 0) {
		throw new Error('No categories found. Generate categories first.');
	}

	return categoryIds;
}

export async function getCityIds() {
	const db = await getDb();

	const allCities = await db.query.cities.findMany({
		columns: {
			id: true,
		},
	});

	const cityIds = allCities.map((r) => r.id);

	if (cityIds.length === 0) {
		throw new Error('No cities found. Generate cities first.');
	}

	return cityIds;
}
