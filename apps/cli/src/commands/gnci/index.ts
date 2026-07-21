import fs from 'node:fs';
import path from 'node:path';
import { command, number, string } from '@drizzle-team/brocli';
import consola from 'consola';
import { strFromU8, unzipSync } from 'fflate';
import { z } from 'zod';
import { Pipeline } from '@/lib/pipeline';

const schema = z.object({
	geonameid: z.string(),
	name: z.string(),
	asciiname: z.string(),
	alternatenames: z.string(),
	latitude: z.string(),
	longitude: z.string(),
	featureclass: z.string(),
	featurecode: z.string(),
	countrycode: z.string(),
	cc2: z.string(),
	admin1: z.string(),
	admin2: z.string(),
	admin3: z.string(),
	admin4: z.string(),
	population: z.string(),
	elevation: z.string(),
	dem: z.string(),
	timezone: z.string(),
	moddate: z.string(),
});

export const gnci = command({
	name: 'gnci',
	desc: 'Geonames City Ingestion Helper - Fetches and processes Geonames city data',
	options: {
		url: string('url')
			.default('https://download.geonames.org/export/dump/cities15000.zip')
			.desc('The URL to download the Geonames city data file from.'),
		filename: string('filename')
			.default('cities15000.txt')
			.desc(
				'The name of the file containing the Geonames city data inside the ZIP.',
			),
		population: number('population')
			.int()
			.min(0)
			.default(500_000)
			.desc('The minimum population threshold for filtering cities.'),
	},
	handler: async (opts) => {
		const pipeline = new Pipeline({
			values: {},
		})
			.addStep({
				name: 'Read file',
				fn: async () => {
					const response = await fetch(opts.url);

					if (!response.ok) {
						throw new Error(`Failed to download file from URL: ${opts.url}`);
					}

					const buffer = await response.arrayBuffer();
					const zipData = new Uint8Array(buffer);
					const files = unzipSync(zipData);
					const targetFile = files[opts.filename];

					if (!targetFile) {
						throw new Error(
							`File "${opts.filename}" not found in the downloaded ZIP file.`,
						);
					}

					const content = strFromU8(targetFile);

					return {
						content,
					};
				},
			})
			.addStep({
				name: 'Parse file content',
				fn: async (ctx) => {
					const lines = ctx.content
						.split('\n')
						.map((l) => l.trim())
						.filter((l) => l.length > 0)
						.map((l) => l.split('\t'));

					const parsed = lines.map((line) => {
						const obj = {
							geonameid: line[0],
							name: line[1],
							asciiname: line[2],
							alternatenames: line[3],
							latitude: line[4],
							longitude: line[5],
							featureclass: line[6],
							featurecode: line[7],
							countrycode: line[8],
							cc2: line[9],
							admin1: line[10],
							admin2: line[11],
							admin3: line[12],
							admin4: line[13],
							population: line[14],
							elevation: line[15],
							dem: line[16],
							timezone: line[17],
							moddate: line[18],
						};

						const parsed = schema.safeParse(obj);

						if (!parsed.success) {
							throw new Error(
								`Failed to parse line into valid object: ${JSON.stringify(obj)}. Error: ${parsed.error.message}`,
							);
						}

						return parsed.data;
					});

					return {
						parsed,
					};
				},
			})
			.addStep({
				name: 'Filtering',
				fn: async (ctx) => {
					const countriesToKeep = new Set([
						'DK',
						'TR',
						'NL',
						'GR',
						'ES',
						'GB',
						'CZ',
						'IT',
						'AT',
						'PT',
						'FR',
					]);

					const filtered = ctx.parsed.filter(
						(c) =>
							countriesToKeep.has(c.countrycode) &&
							Number.parseInt(c.population, 10) > opts.population,
					);

					return {
						filtered,
					};
				},
			})
			.addStep({
				name: 'Output',
				fn: async (ctx) => {
					fs.writeFileSync(
						path.join(process.cwd(), 'geonames_cities.json'),
						JSON.stringify(ctx.filtered, null, 2),
						'utf-8',
					);
				},
			})
			.addStep({
				name: 'Finalizing',
				fn: async () => {
					consola.success(
						'Geonames city ingestion process completed successfully. Output file: geonames_cities.json',
					);
				},
			});

		await pipeline.run();
	},
});
