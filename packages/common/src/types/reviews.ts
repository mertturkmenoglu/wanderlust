import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';
import { Asset } from './assets';
import { Places } from './places';
import { Resources } from './resources';
import { RichTextFacet } from './richtext';
import { Timestamp } from './timestamp';
import { Users } from './users';

export const Review = createSelectSchema(schema.reviews, {
	id: Resources.id,
	placeId: Resources.id,
	userId: Resources.id,
	content: z
		.string()
		.min(1)
		.meta({
			description: 'Content of the review',
			examples: ['Amazing place! Had a wonderful time exploring the exhibits.'],
		}),
	facets: z.array(RichTextFacet),
	rating: z
		.number()
		.min(1)
		.max(5)
		.meta({
			description: 'Rating given by the user',
			examples: [5],
		}),
	visitedAt: Timestamp,
	createdAt: Timestamp,
	updatedAt: Timestamp,
}).meta({
	description: 'A review entity',
});

export namespace Reviews {
	export const Extended = Review.extend({
		user: Users.View.Basic,
		assets: Asset.array(),
	});

	export const ExtendedWithPlace = Extended.extend({
		place: Places.Extended,
	});

	export const Meta = z.object({
		isLiked: z.boolean().meta({
			description: 'Indicates whether the review is liked by the user',
			examples: [true, false],
		}),
	});

	export namespace $Insert {
		export const Review = createInsertSchema(schema.reviews, {
			detectedLanguage: z.string().nullable(),
			facets: z.array(RichTextFacet),
		});

		export type Review = z.infer<typeof Review>;
	}
}
