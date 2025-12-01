import type { Client } from 'typesense';

export async function createSchemas(client: Client) {
	try {
		await client.collections().create({
			name: 'places',
			enable_nested_fields: true,
			fields: [
				{
					name: 'name',
					type: 'string',
				},
				{
					name: 'location',
					type: 'geopoint',
				},
				{
					name: 'place',
					type: 'object',
					facet: true,
					index: true,
				},
			],
		});
	} catch (err) {
		if (err instanceof Error) {
			const isExistsErr = err.message.includes('already exists');

			if (isExistsErr) {
				console.log('Schemas already exist. Skipping creation.');
				return;
			}
		}

		throw err;
	}
}
