import type { Client } from 'typesense';
import { DbProvider } from '@/db';
import * as schema from '@/db/schema';
import { ioc } from '@/ioc';
import { createSchemas } from './create-schemas';

export async function handlePlaces(client: Client) {
	const db = ioc.resolve(DbProvider.id);
	const count = await db.$count(schema.places);
	const step = 1000;

	// Delete existing documents
	await client
		.collections('places')
		.delete()
		.catch((err) => {
			if (err instanceof Error) {
				console.error({ message: err.message });
				const isNotFoundErr = err.message.includes('No collection with name');

				if (isNotFoundErr) {
					return;
				}
			}

			throw err;
		});

	// Re-create schemas
	await createSchemas(client);

	let lastCreatedAt: Date | null = null;

	for (let i = 0; i < count; i += step) {
		const query = db.query.places.findMany({
			where: (t, { gt }) => gt(t.createdAt, lastCreatedAt ?? new Date(0)),
			orderBy: (t, { asc }) => [asc(t.createdAt), asc(t.name)],
			limit: step,
			with: {
				address: {
					with: {
						city: true,
					},
				},
				assets: true,
				category: true,
			},
		});

		const places = await query;
		lastCreatedAt = places.at(-1)?.createdAt ?? lastCreatedAt;

		const docs = places.map((place) => ({
			name: place.name,
			place,
			location: [place.address.lat, place.address.lng],
		}));

		await client.collections('places').documents().import(docs, {
			action: 'upsert',
		});
	}
}
