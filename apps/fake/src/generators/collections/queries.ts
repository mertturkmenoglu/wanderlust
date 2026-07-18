import { getDb } from '@/lib/common';

export async function getCityIds() {
	const db = await getDb();
	const res = await db.query.cities.findMany({
		columns: {
			id: true,
		},
	});

	return res.map((city) => city.id);
}
