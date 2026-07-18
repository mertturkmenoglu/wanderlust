import { defineGenerator } from '@/lib/define-generator';
import { Fake } from '@/lib/fake';
import { processChunk } from './process';

export const assetsGenerator = defineGenerator({
	generate: async () => {
		const places = await Fake.File.read('places');
		const chunks = Fake.Chunk.fromArray(places, 500);
		const results = await Promise.allSettled(chunks.map(processChunk));

		void Fake.Promise.allMustSettle(results);
	},
});
