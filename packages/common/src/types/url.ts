import { z } from 'zod';

export const Url = z.url().min(1).max(512).meta({
	description: 'A valid URL',
	example: 'https://example.com',
});
