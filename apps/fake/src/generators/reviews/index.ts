import os from 'node:os';
import Piscina from 'piscina';
import { defineGenerator } from '@/lib/define-generator';
import { Fake } from '@/lib/fake';

export const reviewsGenerator = defineGenerator({
	generate: async () => {
		const places = await Fake.File.read('places');
		const users = await Fake.File.read('users');
		const chunks = Fake.Chunk.fromArray(places, 250);

		const pool = new Piscina({
			filename: new URL('./process.ts', import.meta.url).href,
			minThreads: os.availableParallelism(),
		});

		const results = await Promise.allSettled(
			chunks.map((c) =>
				pool.run({ placeIds: c, userIds: users }, { name: 'processChunk' }),
			),
		);

		void Fake.Promise.allMustSettle(results);
	},
});

export const reviewAssetsGenerator = defineGenerator({
	generate: async () => {
		const reviews = await Fake.File.read('reviews');
		const chunks = Fake.Chunk.fromArray(reviews, 1000);

		const pool = new Piscina({
			filename: new URL('./process-assets.ts', import.meta.url).href,
			minThreads: 5,
			maxThreads: 10,
		});

		const results = await Promise.allSettled(
			chunks.map((c) => pool.run({ reviewIds: c }, { name: 'processChunk' })),
		);

		void Fake.Promise.allMustSettle(results);
	},
});
