import { faker } from '@faker-js/faker';
import type { Types } from '@wanderlust/common';
import { schema } from '@wanderlust/db';
import { z } from 'zod';
import { data } from '@/fixtures/accolades';
import { getDb } from '@/lib/common';
import { defineGenerator } from '@/lib/define-generator';
import { Fake } from '@/lib/fake';

type Insert = Types.Accolades.$Insert.Accolade;

const zSchema = z.string().slugify();

export const accoladesGenerator = defineGenerator({
	generate: async () => {
		const db = await getDb();

		const inserts: Insert[] = data.map((title) => ({
			id: zSchema.parse(title),
			title,
			description: faker.lorem.paragraph(),
			badge: faker.image.avatarGitHub(),
			image: faker.image.url(),
		}));

		await db.insert(schema.accolades).values(inserts);
	},
});

type AssignmentInsert = Types.Accolades.$Insert.Assignment;

export const accoladeAssignmentsGenerator = defineGenerator({
	generate: async () => {
		const accoladeIds = await Fake.File.read('accolades');
		const placeIds = await Fake.File.read('places');
		const batch: AssignmentInsert[] = [];

		for (const placeId of placeIds) {
			if (Math.random() < 0.9) {
				continue; // Skip most places to create a more realistic distribution of accolades
			}

			const randomAccoladeIds = faker.helpers.arrayElements(accoladeIds, {
				min: 1,
				max: 3,
			});

			batch.push(
				...randomAccoladeIds.map((accoladeId) => ({
					placeId,
					accoladeId,
					id: faker.string.uuid(),
				})),
			);
		}

		const db = await getDb();

		await db
			.insert(schema.accoladeAssignments)
			.values(batch)
			.onConflictDoNothing();
	},
});
