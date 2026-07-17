import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';
import { Resources } from './resources';
import { Timestamp } from './timestamp';

export const Report = createSelectSchema(schema.reports, {
	id: Resources.id,
	resourceId: Resources.id,
	resourceType: z
		.string()
		.min(1)
		.max(32)
		.meta({
			description: 'Type of the reported resource',
			examples: ['place', 'review', 'comment', 'user'],
		}),
	reporterId: Resources.id,
	reason: z
		.number()
		.int()
		.min(1)
		.max(32)
		.meta({
			description: 'Reason for reporting the resource',
			examples: ['Inappropriate content'],
		}),
	description: z
		.string()
		.min(1)
		.max(2048)
		.nullable()
		.meta({
			description: 'Additional description provided by the reporter',
			examples: ['The content contains offensive language.'],
		}),
	resolved: z.boolean().meta({
		description: 'Whether the report has been resolved',
		examples: [false],
	}),
	resolvedAt: Timestamp.nullable(),
	createdAt: Timestamp,
	updatedAt: Timestamp,
}).meta({
	description: 'A report entity',
});

export namespace Reports {
	export namespace $Insert {
		export const Report = createInsertSchema(schema.reports);
	}
}
