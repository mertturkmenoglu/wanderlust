import { faker } from '@faker-js/faker';
import type z from 'zod';
import { DbProvider } from '@/db';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { ioc } from '@/ioc';

const COUNT = 10_000;
const STEP = 1_000;

type Insert = z.infer<typeof $insert.address>;

export async function generate() {
	for (let i = 0; i < COUNT; i += STEP) {
		await batchInsert();
	}
}

async function batchInsert() {
	const db = ioc.resolve(DbProvider.id);

	const cities = await db.query.cities.findMany({
		columns: {
			id: true,
			lat: true,
			lng: true,
		},
	});

	const batch: Insert[] = [];

	for (let i = 0; i < STEP; i++) {
		const city = faker.helpers.arrayElement(cities);

		const lat = city.lat + faker.number.float({ min: -0.02, max: 0.02 });
		const lng = city.lng + faker.number.float({ min: -0.02, max: 0.02 });

		batch.push({
			cityId: city.id,
			line1: faker.location.streetAddress(),
			line2: faker.location.secondaryAddress(),
			postalCode: faker.location.zipCode(),
			lat: lat,
			lng: lng,
		});
	}

	await db.insert(schema.addresses).values(batch);
}
