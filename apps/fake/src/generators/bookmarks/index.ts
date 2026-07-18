import { defineGenerator } from '@/lib/define-generator';
import { Fake } from '@/lib/fake';
import { processChunk } from './process';

export const bookmarksGenerator = defineGenerator({
	generate: async () => {
		const users = await Fake.File.read('users');
		const places = await Fake.File.read('places');
		const chunks = Fake.Chunk.fromArray(users, 100);

		const results = await Promise.allSettled(
			chunks.map((c) => processChunk(c, places)),
		);

		void Fake.Promise.allMustSettle(results);
	},
});
