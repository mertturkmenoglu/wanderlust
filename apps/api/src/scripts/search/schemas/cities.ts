import { isCollectionExistsError } from '../err-utils';
import { TSSchema } from './tsschema';

export class CitiesSchema extends TSSchema {
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
						name: 'city',
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

		const cities = await this.db.query.cities.findMany({});

		const docs = cities.map((city) => ({
			name: city.name,
			city,
			location: [city.lat, city.lng],
		}));

		await this.client
			.collections(this.name)
			.documents()
			.import(docs, {
				action: 'upsert',
			});
	}
}
