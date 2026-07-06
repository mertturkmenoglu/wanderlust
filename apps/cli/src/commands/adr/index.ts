import fs from 'node:fs';
import path from 'node:path';
import { command, string } from '@drizzle-team/brocli';
import slugify from '@sindresorhus/slugify';
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
				name: 'Formatting title',
				fn: async () => {
					const title = opts.title.trim().toLowerCase();
					const titleAsTitleCase = title
						.split(' ')
						.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
						.join(' ');

					return {
						title,
						titleAsTitleCase,
					};
				},
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
					const lastAdrFile = adrFiles.at(-1);

					return {
						lastAdrFile,
					};
				},
			})
			.addStep({
				name: 'Getting new ADR filename and number',
				fn: async (ctx) => {
					const [newAdrFilename, newAdrNumber] = getNewAdrFilenameAndNumber(
						ctx.title,
						ctx.lastAdrFile,
					);

					return {
						newAdrFilename,
						newAdrNumber,
					};
				},
			})
			.addStep({
				name: 'Read ADR template file',
				fn: async () => {
					const adrTemplateFilepath = path.join(adrDirPath, 'template.md');
					const templateContent = fs.readFileSync(adrTemplateFilepath, 'utf-8');

					return {
						templateContent,
					};
				},
			})
			.addStep({
				name: 'Create ADR file content',
				fn: async ({ templateContent, newAdrNumber, titleAsTitleCase }) => {
					const newAdrContent = templateContent.replace(
						'# ADR-0001: <short title in Title Case>',
						`# ADR-${newAdrNumber.toString().padStart(4, '0')}: ${titleAsTitleCase}`,
					);

					return {
						newAdrContent,
					};
				},
			})
			.addStep({
				name: 'Create ADR file',
				fn: async (ctx) => {
					const newAdrFilepath = path.join(adrDirPath, ctx.newAdrFilename);

					fs.writeFileSync(newAdrFilepath, ctx.newAdrContent, 'utf-8');
				},
			})
			.addStep({
				name: 'Finalizing',
				fn: async ({ newAdrFilename }) => {
					consola.success(
						`ADR creation process completed successfully. New ADR file: ${newAdrFilename}`,
					);
				},
			});

		await pipeline.run();
	},
});

function getNewAdrFilenameAndNumber(
	title: string,
	lastAdr?: string,
): [string, number] {
	const slugifiedTitle = slugify(title, { separator: '-' });

	if (lastAdr === undefined) {
		return [`0001-${slugifiedTitle}.md`, 1];
	}

	const [numstr] = lastAdr.split('-');

	if (!numstr) {
		throw new Error(`Invalid last ADR file name: ${lastAdr}`);
	}

	const lastAdrNumber = Number.parseInt(numstr, 10);

	if (Number.isNaN(lastAdrNumber)) {
		throw new Error(
			`Invalid last ADR file name, expected a number at the start: ${lastAdr}`,
		);
	}

	const newAdrNumber = lastAdrNumber + 1;
	const newAdrFileName = `${newAdrNumber.toString().padStart(4, '0')}-${slugifiedTitle}.md`;
	return [newAdrFileName, newAdrNumber];
}
