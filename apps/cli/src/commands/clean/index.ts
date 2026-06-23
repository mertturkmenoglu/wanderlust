import path from 'node:path';
import { command } from '@drizzle-team/brocli';
import { $ } from 'bun';
import consola from 'consola';

export const clean = command({
	name: 'clean',
	desc: 'Removes and recreates all Docker containers and pushes the database schema',
	options: {},
	handler: async (_opts) => {
		const apiProjectPath = path.join(process.cwd(), '..', 'api');

		const dockerComposeFilePath = path.join(
			apiProjectPath,
			'docker-compose.yml',
		);

		consola.start('Removing and recreating Docker containers');

		await $`docker compose -f ${dockerComposeFilePath} down -v`;

		await $`docker compose -f ${dockerComposeFilePath} up -d --wait`;

		consola.info('Pushing database schema');

		await $`bun run --cwd ${apiProjectPath} db:push`;

		consola.success('Docker containers removed and recreated successfully.');
	},
});
