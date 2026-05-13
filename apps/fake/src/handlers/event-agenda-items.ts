import { faker } from '@faker-js/faker';
import type { $insert } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import type z from 'zod';
import { paths } from '..';
import { chunkArray, readFile } from '../utils';
import { getDb } from './common';

type Insert = z.infer<typeof $insert.eventAgendaItem>;

export async function generate() {
	const eventIds = await readFile(paths.events);
	const chunks = chunkArray(eventIds, 100);

	const results = await Promise.allSettled(
		chunks.map((chunk) => processChunk(chunk)),
	);

	for (const result of results) {
		if (result.status === 'rejected') {
			throw new Error('Failed to generate event agenda items', {
				cause: result.reason,
			});
		}
	}
}

async function processChunk(eventIds: string[]) {
	const db = await getDb();

	const events = await db.query.events.findMany({
		where: (t, { inArray }) => inArray(t.id, eventIds),
		columns: { id: true, startsAt: true, endsAt: true },
	});

	const batch: Insert[] = [];

	for (const event of events) {
		const hasAgenda = faker.datatype.boolean({ probability: 0.6 });
		if (!hasAgenda) continue;

		const count = faker.number.int({ min: 2, max: 8 });
		const totalMs = event.endsAt.getTime() - event.startsAt.getTime();
		const slotMs = Math.floor(totalMs / count);

		for (let i = 0; i < count; i++) {
			const startsAt = new Date(event.startsAt.getTime() + i * slotMs);
			const endsAt = new Date(
				startsAt.getTime() + faker.number.int({ min: slotMs / 2, max: slotMs }),
			);

			batch.push({
				id: nanoid(),
				eventId: event.id,
				startsAt,
				endsAt: endsAt > event.endsAt ? event.endsAt : endsAt,
				title: faker.lorem.sentence({ min: 2, max: 6 }).replace(/\.$/, ''),
				description: faker.datatype.boolean({ probability: 0.6 })
					? faker.lorem.sentence()
					: null,
			});
		}
	}

	if (batch.length > 0) {
		await db.insert(schema.eventAgendaItems).values(batch);
	}
}
