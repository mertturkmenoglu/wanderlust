import fs from 'node:fs';
import path from 'node:path';
import { command, string } from '@drizzle-team/brocli';
import consola from 'consola';
import { Pipeline } from '@/lib/pipeline';

export const adr = command({
	name: 'adr',
	desc: 'Create a new ADR (Architecture Decision Record) file in the project.',
	options: {
		title: string('title').desc('The title of the ADR.').required(),
	},
	handler: async (opts) => {
		const repoRootPath = path.join(process.cwd(), '..', '..');
		const adrDirPath = path.join(repoRootPath, 'docs', 'adr');

		const pipeline = new Pipeline({
			values: {},
		})
			.addStep({
				name: 'Ensuring ADR directory exists',
				fn: async () => {
					if (!fs.existsSync(adrDirPath)) {
						throw new Error(`ADR directory does not exist: ${adrDirPath}`);
					}
				},
			})
			.addStep({
				name: 'Getting last ADR file',
				fn: async () => {
					const allFiles = fs.readdirSync(adrDirPath).toSorted();
					const adrFiles = allFiles.filter(
						(file) => file.endsWith('.md') && /^[0-9]{4}\S*\.md$/.test(file),
					);
					const last = adrFiles.at(-1);

					return {
						last,
					};
				},
			})
			.addStep({
				name: 'Getting next number',
				fn: async (ctx) => {
					const next = getNextNumber(ctx.last);

					return {
						next,
					};
				},
			})
			.addStep({
				name: 'Getting new ADR filename',
				fn: async (ctx) => {
					const nextFile = `${pad(ctx.next)}.md`;

					return {
						nextFile,
					};
				},
			})
			.addStep({
				name: 'Read ADR template file',
				fn: async () => {
					const fp = path.join(adrDirPath, 'template.md');
					const template = fs.readFileSync(fp, 'utf-8');

					return {
						template,
					};
				},
			})
			.addStep({
				name: 'Create ADR file content',
				fn: async ({ template, next }) => {
					const datestr = new Date().toISOString().split('T')[0];

					if (!datestr) {
						throw new Error('Failed to get current date in YYYY-MM-DD format.');
					}

					const padded = pad(next);

					const newContent = template
						.replaceAll('{id}', next.toString())
						.replaceAll('{state}', 'accepted')
						.replaceAll('{created}', datestr)
						.replaceAll('{updated}', datestr)
						.replaceAll('{title}', opts.title)
						.replaceAll('{paddedId}', padded)
						.replaceAll('{clDescription}', 'Created');

					return {
						newContent,
					};
				},
			})
			.addStep({
				name: 'Create ADR file',
				fn: async ({ nextFile, newContent }) => {
					fs.writeFileSync(
						path.join(adrDirPath, nextFile),
						newContent,
						'utf-8',
					);
				},
			})
			.addStep({
				name: 'Finalizing',
				fn: async ({ nextFile }) => {
					consola.success(
						`ADR creation process completed successfully. New ADR file: ${nextFile}`,
					);
				},
			});

		await pipeline.run();
	},
});

function getNextNumber(last?: string): number {
	if (last === undefined) {
		return 1;
	}

	const numstr = last.split('.')[0];

	if (!numstr) {
		throw new Error(
			`Invalid last ADR file name, expected a number at the start: ${last}`,
		);
	}

	const lastAdrNumber = Number.parseInt(numstr, 10);

	if (Number.isNaN(lastAdrNumber)) {
		throw new Error(
			`Invalid last ADR file name, expected a number at the start: ${last}`,
		);
	}

	return lastAdrNumber + 1;
}

function pad(adr: number): string {
	return adr.toString().padStart(4, '0');
}
