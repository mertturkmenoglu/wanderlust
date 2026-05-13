import { faker } from '@faker-js/faker';
import type { $insert } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import type z from 'zod';
import { paths } from '..';
import { chunkArray, readFile } from '../utils';
import { getDb } from './common';

const badges = [
	'Headliner',
	'DJ',
	'Speaker',
	'Performer',
	'Opening Act',
	'Host',
	'Special Guest',
	'Keynote',
	'Panelist',
	'MC',
];

type Insert = z.infer<typeof $insert.eventLineupItem>;

export async function generate() {
	const eventIds = await readFile(paths.events);
	const userIds = await readFile(paths.users);

	const chunks = chunkArray(eventIds, 100);

	const results = await Promise.allSettled(
		chunks.map((chunk) => processChunk(chunk, userIds)),
	);

	for (const result of results) {
		if (result.status === 'rejected') {
			throw new Error('Failed to generate event lineup items', {
				cause: result.reason,
			});
		}
	}
}

async function processChunk(eventIds: string[], userIds: string[]) {
	const db = await getDb();
	const batch: Insert[] = [];

	for (const eventId of eventIds) {
		const hasLineup = faker.datatype.boolean({ probability: 0.5 });
		if (!hasLineup) continue;

		const count = faker.number.int({ min: 1, max: 6 });

		for (let order = 1; order <= count; order++) {
			const linkedToUser = faker.datatype.boolean({ probability: 0.5 });
			const userId = linkedToUser ? faker.helpers.arrayElement(userIds) : null;
			const firstName = faker.person.firstName();
			const lastName = faker.person.lastName();

			batch.push({
				id: nanoid(),
				eventId,
				name: `${firstName} ${lastName}`,
				userId,
				badge: faker.helpers.arrayElement(badges),
				title: faker.datatype.boolean({ probability: 0.6 })
					? faker.person.jobTitle()
					: null,
				description: faker.datatype.boolean({ probability: 0.4 })
					? faker.lorem.sentence()
					: null,
				order,
			});
		}
	}

	if (batch.length > 0) {
		await db.insert(schema.eventLineupItems).values(batch);
	}
}
