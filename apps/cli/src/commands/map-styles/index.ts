import { boolean, command, string } from '@drizzle-team/brocli';
import { inspect } from 'bun';
import consola from 'consola';
import z from 'zod';

const schema = z.array(
	z.object({
		referenceStyleID: z.string(),
		name: z.string(),
		description: z.string().optional(),
		variants: z.array(
			z.object({
				id: z.string(),
				name: z.string(),
				variantType: z.string(),
				description: z.string().optional(),
				imageURL: z.string(),
				deprecated: z.boolean().optional(),
				deprecationMessage: z.string().optional(),
			}),
		),
	}),
);

const outputSchema = z.array(z.object({
	key: z.string(),
	text: z.string(),
}));

type TOutput = z.infer<typeof outputSchema>;

const defaultCodeUrl =
	'https://raw.githubusercontent.com/maptiler/maptiler-client-js/refs/heads/main/src/mapstyle.ts';

export const mapStyles = command({
	name: 'map-styles',
	desc: 'Gets the latest map styles from MapTiler repo and prints them to the console.',
	options: {
		includeDeprecated: boolean('include-deprecated').default(false).desc('Whether to include deprecated map styles in the output'),
		codeUrl: string('code-url')
			.default(defaultCodeUrl)
			.desc('The URL to the mapstyle.ts file in the MapTiler Client repo'),
		outputPath: string('output-path')
			.default('output.json')
			.desc('The path to the output file where the map styles will be saved'),
	},
	handler: async (opts) => {
		const res = await fetch(opts.codeUrl);

		if (!res.ok) {
			consola.error(`Failed to fetch map styles from ${opts.codeUrl}`);
			process.exit(1);
		}

		const rawCode = await res.text();
		const regex = /const MAP_STYLE_CONFIG = \[[\s\S]*\] as const;/;

		const match = rawCode.match(regex);

		if (!match) {
			consola.error(
				'Failed to find the MAP_STYLE_CONFIG array in the fetched code.',
			);
			process.exit(1);
		}

		const firstMatch = match[0]
			.replace('const MAP_STYLE_CONFIG = ', '')
			.replace(' as const;', '');

		// biome-ignore lint/security/noGlobalEval: We are using eval here to parse the fetched code. It's not ideal but I don't see an easier way than this to achieve the same thing.
		const anyArr = eval(firstMatch);

		const validated = schema.safeParse(anyArr);

		if (!validated.success) {
			consola.error(
				'Failed to validate the fetched map styles:',
				inspect(validated.error),
			);
			process.exit(1);
		}

		const ids: TOutput = validated.data.flatMap((s) => {
			const filtered = opts.includeDeprecated
				? s.variants
				: s.variants.filter((v) => !v.deprecated);
			return filtered.map((v) => ({
				key: v.id,
				text: createName(v.id),
			}));
		});

		await Bun.write(opts.outputPath, JSON.stringify(ids, null, 2));

		process.exit(0);
	},
});

function createName(id: string) {
	const parts = id.split('-');
	const capitalizedParts = parts.map((part) => {
		return part.charAt(0).toUpperCase() + part.slice(1);
	});

	return capitalizedParts.join(' ');
}
