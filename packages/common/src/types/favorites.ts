import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import type { z } from 'zod';
import { Places } from './places';
import { Resources } from './resources';
import { Timestamp } from './timestamp';

export const Favorite = createSelectSchema(schema.favorites, {
	id: Resources.id,
	placeId: Resources.id,
	userId: Resources.id,
	createdAt: Timestamp,
}).meta({
	description: 'A favorite entity',
});

export namespace Favorites {
	export const Extended = Favorite.extend({
		place: Places.Extended,
	});

	export namespace $Insert {
		export const Favorite = createInsertSchema(schema.favorites);

		export type Favorite = z.infer<typeof Favorite>;
	}
}
