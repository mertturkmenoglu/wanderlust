import { faker } from '@faker-js/faker';
import type z from 'zod';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { container } from '@/ioc';
import { DatabaseService } from '@/lib/db';
import { chunkArray, readFile } from '@/lib/fake/utils';
import { nanoid } from '@/lib/uid';
import { paths } from '..';

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
	const db = container.get(DatabaseService).get();
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
