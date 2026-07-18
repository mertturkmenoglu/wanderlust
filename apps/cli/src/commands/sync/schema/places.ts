import { schema } from '@wanderlust/db';
import { isCollectionExistsError } from '../utils/err-utils';
import { AbstractSchema } from './abstract-schema';

export class PlacesSchema extends AbstractSchema {
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
			const places = await this.findMany(lastCreatedAt, step);
			lastCreatedAt = places.at(-1)?.createdAt ?? lastCreatedAt;

			const docs = places.map((place) => ({
				name: place.name,
				place,
				location: [place.lat, place.lng],
			}));

			await this.client.collections('places').documents().import(docs, {
				action: 'upsert',
			});
		}

		const remaining = await this.findMany(lastCreatedAt, step);

		if (remaining.length > 0) {
			const docs = remaining.map((place) => ({
				name: place.name,
				place,
				location: [place.lat, place.lng],
			}));

			await this.client.collections('places').documents().import(docs, {
				action: 'upsert',
			});
		}
	}

	private async findMany(lastCreatedAt: Date | null, limit: number) {
		return this.db.query.places.findMany({
			where: {
				createdAt: {
					gt: lastCreatedAt ?? new Date(0),
				},
			},
			orderBy: (t, { asc }) => [asc(t.createdAt), asc(t.name)],
			limit: limit,
			with: {
				assets: true,
				city: true,
				primaryCategory: true,
				accolades: true,
			},
		});
	}
}
