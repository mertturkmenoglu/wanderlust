import * as schema from '@wanderlust/db';
import { isCollectionExistsError } from '../err-utils';
import { TSSchema } from './tsschema';

export class PlacesSchema extends TSSchema {
	override async createCollection() {
		try {
			await this.client.collections().create({
				name: this.name,
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
			if (isCollectionExistsError(err)) {
				console.log(
					`Collection ${this.name} already exists, skipping creation`,
				);
				return;
			}

			throw err;
		}
	}

	override async sync() {
		await this.deleteCollection();

		await this.createCollection();

		const count = await this.db.$count(schema.places);
		const step = 1000;

		let lastCreatedAt: Date | null = null;

		for (let i = 0; i < count; i += step) {
			const places = await this.db.query.places.findMany({
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
					accolades: {
						with: {
							accolade: true,
						}
					}
				},
			});

			lastCreatedAt = places.at(-1)?.createdAt ?? lastCreatedAt;

			const docs = places.map((place) => ({
				name: place.name,
				place,
				location: [place.address.lat, place.address.lng],
			}));

			await this.client.collections('places').documents().import(docs, {
				action: 'upsert',
			});
		}
	}
}
