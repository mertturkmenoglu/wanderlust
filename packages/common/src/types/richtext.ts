import { z } from 'zod';

export const RichTextFacet = z
	.object({
		type: z.string(),
		value: z.string(),
		start: z.number(),
		end: z.number(),
	})
	.meta({
		description: 'Facets detected in the review content',
		examples: [
			{
				type: 'url',
				value: 'https://example.com',
				start: 10,
				end: 30,
			},
			{
				type: 'mention',
				value: '@username',
				start: 35,
				end: 44,
			},
		],
	});
