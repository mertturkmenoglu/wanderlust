import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';
import { Resources } from './resources';
import { Timestamp } from './timestamp';
import { Url } from './url';

export const Accolade = createSelectSchema(schema.accolades, {
	id: Resources.id,
	title: z
		.string()
		.min(1)
		.max(256)
		.meta({
			description: 'Title of the accolade',
			examples: ['Best Museum'],
		}),
	description: z
		.string()
		.min(1)
		.max(1024)
		.meta({
			description: 'Description of the accolade',
			examples: ['Awarded for outstanding museum experience'],
		}),
	badge: Url,
	image: Url,
	createdAt: Timestamp,
	updatedAt: Timestamp,
});

export namespace Accolades {
	export namespace $Insert {
		export const Accolade = createInsertSchema(schema.accolades, {
			title: z
				.string()
				.min(1)
				.max(256)
				.meta({
					description: 'Title of the accolade',
					examples: ['Best Museum'],
				}),
			description: z
				.string()
				.min(1)
				.max(1024)
				.meta({
					description: 'Description of the accolade',
					examples: ['Awarded for outstanding museum experience'],
				}),
			badge: Url,
			image: Url,
		});

		export const Assignment = createInsertSchema(schema.accoladeAssignments);
	}
}
