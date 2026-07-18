import pLimit from 'p-limit';
import { getDb } from '@/lib/common';
import { defineGenerator } from '@/lib/define-generator';
import { Fake } from '@/lib/fake';
import { processListChunk } from './process';
import { processListItemChunk } from './process-items';

export const listsGenerator = defineGenerator({
	generate: async () => {
		const db = await getDb();
		const users = await Fake.File.read('users');
		const chunks = Fake.Chunk.fromArray(users, 100);
		const limit = pLimit(4);

		const results = await Promise.allSettled(
			chunks.map((c) => limit(() => processListChunk(db, c))),
		);

		void Fake.Promise.allMustSettle(results);
	},
});

export const listItemsGenerator = defineGenerator({
	generate: async () => {
		const db = await getDb();
		const lists = await Fake.File.read('lists');
		const places = await Fake.File.read('places');
		const chunks = Fake.Chunk.fromArray(lists, 100);
		const limit = pLimit(4);

		const results = await Promise.allSettled(
			chunks.map((c) => limit(() => processListItemChunk(db, c, places))),
		);

		void Fake.Promise.allMustSettle(results);
	},
});
