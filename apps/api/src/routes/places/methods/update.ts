import { Tokens } from '@wanderlust/common';
import type { Places } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../shared/router';
import { findPlaceById } from '../shared/statements';

@injectable()
export class UpdatePlaceMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.update
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await this.execute(input);

				return result;
			});
	}

	private async execute(
		data: Places.dto.UpdateInput,
	): Promise<Places.dto.UpdateOutput> {
		const { id, ...updateData } = data;

		const [place] = await this.db
			.update(schema.places)
			.set(updateData)
			.where(eq(schema.places.id, id))
			.returning();

		invariant(place, 'NOT_FOUND', `Place with ID ${id} not found`);

		const updated = await this.find(place.id);

		return {
			place: updated,
		};
	}

	private async find(id: string) {
		const place = await findPlaceById.execute(this.db, { id });

		invariant(place, 'NOT_FOUND', `Place with ID ${id} not found`);

		return place;
	}
}
