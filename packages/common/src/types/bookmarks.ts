import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
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

	export namespace $Insert {
		export const Bookmark = createInsertSchema(schema.bookmarks, {
			placeId: Resources.id,
		}).pick({
			placeId: true,
		});
	}
}
