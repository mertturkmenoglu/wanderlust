import { z } from 'zod';

export const Timestamp = z.date().meta({
	description: 'A timestamp representing a specific point in time',
	examples: [new Date('2023-01-15T10:00:00Z')],
});
