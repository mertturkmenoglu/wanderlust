import { z } from 'zod';

export namespace Resources {
	export const id = z
		.string()
		.min(1)
		.max(63)
		.meta({
			description: 'Unique identifier for the resource',
			examples: ['resource123'],
		});
}
