import path from 'node:path';
import { boolean, command } from '@drizzle-team/brocli';
import { $ } from 'bun';
import consola from 'consola';
import { Pipeline } from '@/lib/pipeline';

export const doctor = command({
	name: 'doctor',
	desc: 'Checks the system for required dependencies and see if they are installed and running correctly.',
	options: {
		dockerRun: boolean('docker-run')
			.desc('Check if Docker is running.')
			.default(true),
	},
	handler: async (opts) => {
		const pipeline = new Pipeline({
			values: {},
		})
			.addStep({
				name: 'Starting',
				fn: async () => {
					const repoRootPath = path.join(process.cwd(), '..', '..');
					return {
						repoRootPath,
					};
				},
			})
			.addStep({
				name: 'Checking Bun',
				fn: async () => {
					const res = await $`bun --version`.quiet().text();

					if (!res) {
						throw new Error('Bun is not installed. Please install Bun.');
					}

					const bunVersion = res.trim();

					return {
						bunVersion,
					};
				},
			})
			.addStep({
				name: 'Reading monorepo package.json',
				fn: async ({ repoRootPath }) => {
					const rootPackageJsonPath = path.join(repoRootPath, 'package.json');
					const rootPackageJson = JSON.parse(
						await Bun.file(rootPackageJsonPath).text(),
					);

					return {
						rootPackageJson,
					};
				},
			})
			.addStep({
				name: 'Reading Bun and Bun types versions',
				fn: async ({ rootPackageJson }) => {
					const bunCatalogVersion = rootPackageJson?.workspaces?.catalog?.bun;
					const bunTypesCatalogVersion =
						rootPackageJson?.workspaces?.catalog?.['@types/bun'];

					return {
						bunCatalogVersion,
						bunTypesCatalogVersion,
					};
				},
			})
			.addStep({
				name: 'Confirming Bun and Bun types versions',
				fn: async ({
					bunCatalogVersion,
					bunTypesCatalogVersion,
					bunVersion,
				}) => {
					if (!bunCatalogVersion) {
						throw new Error(
							'Bun version is not specified in the root package.json. Please specify it.',
						);
					}

					if (!bunTypesCatalogVersion) {
						throw new Error(
							'Bun types version is not specified in the root package.json. Please specify it.',
						);
					}

					if (typeof bunCatalogVersion !== 'string') {
						throw new Error(
							'Bun version in the root package.json is not a string. Please specify it as a string.',
						);
					}

					if (typeof bunTypesCatalogVersion !== 'string') {
						throw new Error(
							'Bun types version in the root package.json is not a string. Please specify it as a string.',
						);
					}

					const systemBunVersionWithCaret = `^${bunVersion}`;

					if (systemBunVersionWithCaret !== bunCatalogVersion) {
						throw new Error(
							`Bun version mismatch. Expected: ${bunCatalogVersion}, Found: ${systemBunVersionWithCaret}. Please update Bun.`,
						);
					}
				},
			})
			.addStep({
				name: 'Bun checks are completed',
				fn: async ({
					bunVersion,
					bunCatalogVersion,
					bunTypesCatalogVersion,
				}) => {
					consola.info(`Bun version: ${bunVersion}`);
					consola.info(`Root package.json Bun version: ${bunCatalogVersion}`);
					consola.info(
						`Root package.json @types/bun version: ${bunTypesCatalogVersion}`,
					);
				},
			})
			.addStep({
				name: 'Checking Docker',
				fn: async () => {
					const res = await $`docker --version`.quiet().text();

					if (!res) {
						throw new Error('Docker is not installed. Please install Docker.');
					}

					const dockerVersion = res.trim();

					return {
						dockerVersion,
					};
				},
			})
			.addStep({
				name: 'Confirming Docker is running',
				fn: async () => {
					if (!opts.dockerRun) {
						consola.info('Skipping Docker running check.');
						return;
					}

					const { exitCode } = await $`docker info`.quiet().nothrow();

					if (exitCode !== 0) {
						throw new Error('Docker is not running. Please start Docker.');
					}
					consola.info('Docker is running.');
				},
			})
			.addStep({
				name: 'Docker checks are completed',
				fn: async ({ dockerVersion }) => {
					consola.info(`Docker version: ${dockerVersion}`);
				},
			})
			.addStep({
				name: 'Finalizing',
				fn: async () => {
					consola.success(
						'All checks are successful. Your system is ready to run the application.',
					);
				},
			});

		await pipeline.run();
	},
});
