import { schema } from '@wanderlust/db';
import { count, eq, inArray } from 'drizzle-orm';
import { getDb } from '@/lib/common';
import { Fake } from '@/lib/fake';

export async function updateFavoriteCounts(placeIds: string[]) {
	const chunks = Fake.Chunk.fromArray(placeIds, 100);
	const results = await Promise.allSettled(chunks.map(processChunk));

	void Fake.Promise.allMustSettle(results);
}

async function processChunk(placeIds: string[]) {
	const db = await getDb();

	return db.transaction(async (tx) => {
		const rows = await tx
			.select({ placeId: schema.favorites.placeId, cnt: count() })
			.from(schema.favorites)
			.where(inArray(schema.favorites.placeId, placeIds))
			.groupBy(schema.favorites.placeId);

		const countMap = new Map(rows.map((r) => [r.placeId, r.cnt]));

		for (const placeId of placeIds) {
			await tx
				.update(schema.places)
				.set({ totalFavorites: countMap.get(placeId) ?? 0 })
				.where(eq(schema.places.id, placeId));
		}
	});
}
