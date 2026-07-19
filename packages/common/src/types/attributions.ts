import { z } from 'zod';
import { Url } from './url';

export const Attribution = z.object({
	type: z
		.string()
		.min(1)
		.max(16)
		.meta({
			description: 'Type of the attribution (e.g., image, text)',
			examples: ['image'],
		}),
	text: z
		.string()
		.min(1)
		.max(1024)
		.meta({
			description: 'Text of the attribution',
			examples: ['Photo by John Doe on Example'],
		}),
	link: Url,
});

export namespace Attributions {}
