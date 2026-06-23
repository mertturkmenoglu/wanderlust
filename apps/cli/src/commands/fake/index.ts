import path from 'node:path';
import { command } from '@drizzle-team/brocli';
import { $ } from 'bun';
import consola from 'consola';

export const fake = command({
	name: 'fake',
	desc: 'Generates fake data for the application',
	options: {},
	handler: async (_opts) => {
		const projectPath = path.join(process.cwd(), '..', 'fake');

		consola.start('Generating fake data');

		await $`bun run --cwd ${projectPath} fake`;

		consola.success('Fake data generation completed.');
	},
});
