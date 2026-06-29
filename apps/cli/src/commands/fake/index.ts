import path from 'node:path';
import { command } from '@drizzle-team/brocli';
import { $ } from 'bun';
import { Pipeline } from '@/lib/pipeline';

export const fake = command({
	name: 'fake',
	desc: 'Generates fake data for the application',
	options: {},
	handler: async (_opts) => {
		const pipeline = new Pipeline({
			values: {
				path: path.join(process.cwd(), '..', 'fake'),
			},
		}).addStep({
			name: 'Generate fake data',
			fn: async ({ path }) => {
				await $`bun run --cwd ${path} fake`;
			},
		});

		await pipeline.run();
	},
});
