import { z } from 'zod';

export const Timezone = z
	.string()
	.min(1)
	.max(63)
	.meta({
		description: 'IANA timezone name',
		examples: ['Europe/London', 'America/New_York'],
	});
