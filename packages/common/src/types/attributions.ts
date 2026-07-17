import { z } from 'zod';

export const Attribution = z.object({
	type: z
		.string()
		.min(1)
		.meta({
			description: 'Type of the attribution (e.g., image, text)',
			examples: ['image'],
		}),
	text: z
		.string()
		.min(1)
		.meta({
			description: 'Text of the attribution',
			examples: ['Photo by John Doe on Example'],
		}),
	link: z
		.string()
		.min(1)
		.meta({
			description: 'Link associated with the attribution',
			examples: ['https://example.com/photo'],
		}),
});

export namespace Attributions {}
