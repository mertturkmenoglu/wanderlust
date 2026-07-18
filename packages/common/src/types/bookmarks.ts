import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import type { z } from 'zod';
import { Places } from './places';
import { Resources } from './resources';
import { Timestamp } from './timestamp';

export const Bookmark = createSelectSchema(schema.bookmarks, {
	id: Resources.id,
	placeId: Resources.id,
	userId: Resources.id,
	createdAt: Timestamp,
}).meta({
	description: 'A bookmark entity',
});

export namespace Bookmarks {
	export const Extended = Bookmark.extend({
		place: Places.Extended,
		meta: Places.Meta,
	});

	export type Extended = z.infer<typeof Extended>;

	export namespace $Insert {
		export const Bookmark = createInsertSchema(schema.bookmarks, {
			userId: Resources.id,
			placeId: Resources.id,
		}).pick({
			placeId: true,
			userId: true,
		});

		export type Bookmark = z.infer<typeof Bookmark>;
	}
}
