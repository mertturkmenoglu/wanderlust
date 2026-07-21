import fs from 'node:fs';
import { command, string } from '@drizzle-team/brocli';
import { z } from 'zod';
import { Pipeline } from '@/lib/pipeline';

const schema = z.object({
	query: z.object({
		pages: z.record(
			z.string(),
			z.object({
				title: z.string(),
				extract: z.string(),
			}),
		),
	}),
});

export const wikiCity = command({
	name: 'city',
	desc: 'Wikipedia City info extraction',
	options: {
		name: string('name').desc('The name of the city to fetch information for.'),
		url: string('url').desc(
			'The URL to fetch the Wikipedia page from. If provided, the name option will be ignored.',
		),
		view: string('view')
			.enum('basic', 'full')
			.default('basic')
			.desc('The format of the output.'),
		output: string('output')
			.default('output.txt')
			.desc('the output file to save the extract.'),
	},
	handler: async (opts) => {
		let url = '';

		if (opts.url) {
			url = opts.url;
		} else if (opts.name) {
			const formattedName = opts.name.replace(/ /g, '_');
			url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${formattedName}&format=json`;
		} else {
			throw new Error('Either the name or url option must be provided.');
		}

		const pipeline = new Pipeline({
			values: {},
		})
			.addStep({
				name: 'Fetch Wikipedia Extract',
				fn: async () => {
					const response = await fetch(url);

					if (!response.ok) {
						throw new Error('Failed to download file from URL: $opts.url');
					}

					const body = await response.json();
					const parseResult = schema.safeParse(body);

					if (!parseResult.success) {
						throw new Error(
							'Failed to parse JSON response from Wikipedia API',
							{
								cause: parseResult.error,
							},
						);
					}

					const extract = Object.values(parseResult.data.query.pages)[0]
						?.extract;

					if (!extract) {
						throw new Error('No extract found in the Wikipedia API response.');
					}

					return {
						extract,
					};
				},
			})
			.addStep({
				name: 'Transform Extract',
				fn: async (ctx) => {
					if (opts.view === 'basic') {
						const basicExtract = ctx.extract.split('\n\n\n')[0]; // Get the first paragraph

						if (!basicExtract) {
							throw new Error(
								'No extract found in the Wikipedia API response.',
							);
						}

						return {
							formatted: basicExtract,
						};
					}

					return {
						formatted: ctx.extract,
					};
				},
			})
			.addStep({
				name: 'Output Extract',
				fn: async (ctx) => {
					fs.writeFileSync(opts.output, ctx.formatted);
					console.log(`Extract saved to ${opts.output}`);
				},
			});

		await pipeline.run();
	},
});
