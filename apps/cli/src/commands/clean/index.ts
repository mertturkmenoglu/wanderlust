import path from 'node:path';
import { command } from '@drizzle-team/brocli';
import { buckets } from '@wanderlust/storage';
import { $ } from 'bun';
import { Pipeline } from '@/lib/pipeline';

export const clean = command({
	name: 'clean',
	desc: 'Removes and recreates all Docker containers. Pushes the database schema.',
	options: {},
	handler: async (_opts) => {
		const pipeline = new Pipeline({
			values: {},
		})
			.addStep({
				name: 'Starting',
				fn: async () => {
					const apiProjectPath = path.join(process.cwd(), '..', 'api');

					const dockerComposeFilePath = path.join(
						apiProjectPath,
						'docker-compose.yml',
					);

					const seaweedfsContainerName = 'wl-seaweedfs';

					return {
						apiProjectPath,
						dockerComposeFilePath,
						seaweedfsContainerName,
					};
				},
			})
			.addStep({
				name: 'Removing Docker containers',
				fn: async ({ dockerComposeFilePath }) => {
					await $`docker compose -f ${dockerComposeFilePath} down -v`;
				},
			})
			.addStep({
				name: 'Recreating Docker containers',
				fn: async ({ dockerComposeFilePath }) => {
					await $`docker compose -f ${dockerComposeFilePath} up -d --wait`;
				},
			})
			.addStep({
				name: 'Pushing database schema',
				fn: async ({ apiProjectPath }) => {
					await $`bun run --cwd ${apiProjectPath} db:push`;
				},
			})
			.addStep({
				name: 'Creating SeaweedFS buckets and granting access',
				fn: async ({ seaweedfsContainerName }) => {
					for (const bucket of buckets) {
						await createAndGrantAccess(seaweedfsContainerName, bucket);
					}
				},
			});

		await pipeline.run();
	},
});

async function createAndGrantAccess(container: string, bucket: string) {
	// Create the bucket
	await $`echo 's3.bucket.create -name ${bucket}' | docker exec -i ${container} weed shell`.quiet();

	// Grant access to the bucket
	await $`echo 's3.bucket.access -name ${bucket} -user anonymous -access Read,List' | docker exec -i ${container} weed shell`.quiet();
}
