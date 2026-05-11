import { $ } from 'bun';
import consola from 'consola';

async function main() {
	consola.start('Removing and recreating Docker containers');

	await $`docker compose down -v`;

	await $`docker compose up -d --wait`;

	consola.info('Pushing database schema');

	await $`bun run db:push`;

	consola.success('Docker containers removed and recreated successfully.');
}

await main();
