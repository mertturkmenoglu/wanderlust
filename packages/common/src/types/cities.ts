import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';
import { Attribution } from './attributions';
import { Resources } from './resources';
import { Timezone } from './timezone';
import { Url } from './url';

export const City = createSelectSchema(schema.cities, {
	id: Resources.id,
	name: z
		.string()
		.min(1)
		.max(128)
		.meta({
			description: 'Name of the city',
			examples: ['London'],
		}),
	stateCode: z
		.string()
		.min(1)
		.max(16)
		.meta({
			description: 'State code',
			examples: ['ENG'],
		}),
	stateName: z
		.string()
		.min(1)
		.max(64)
		.meta({
			description: 'State name',
			examples: ['England'],
		}),
	countryCode: z
		.string()
		.length(2)
		.meta({
			description: 'Country code',
			examples: ['GB'],
		}),
	countryName: z
		.string()
		.min(1)
		.max(64)
		.meta({
			description: 'Country name',
			examples: ['United Kingdom'],
		}),
	image: Url,
	lat: z.number(),
	lng: z.number(),
	description: z
		.string()
		.min(1)
		.meta({
			description: 'Description of the city',
			examples: [
				'London is the capital city of the United Kingdom, known for its rich history and vibrant culture.',
			],
		}),
	timezone: Timezone,
	attributions: Attribution.array(),
}).meta({
	description: 'A city entity',
});

export type City = z.infer<typeof City>;

export namespace Cities {
	export namespace $Insert {
		export const City = createInsertSchema(schema.cities, {
			id: Resources.id,
			name: z.string().min(1).max(128),
			stateCode: z.string().min(1).max(16),
			stateName: z.string().min(1).max(64),
			countryCode: z.string().length(2),
			countryName: z.string().min(1).max(64),
			image: Url,
			lat: z.number().min(-90).max(90),
			lng: z.number().min(-180).max(180),
			description: z.string().min(1),
			timezone: Timezone,
			attributions: Attribution.array(),
		});
	}
}
