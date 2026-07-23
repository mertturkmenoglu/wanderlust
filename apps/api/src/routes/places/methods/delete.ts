import { Tokens } from '@wanderlust/common';
import type { Places } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { requireAuth } from '@/middlewares/authn';
import { isAdmin } from '@/middlewares/is-admin';
import { os } from '../shared/router';

@injectable()
export class DeletePlaceMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.delete
			.use(requireAuth)
			.use(isAdmin)
			.handler(async ({ input }) => {
				const result = await this.execute(input);

				return result;
			});
	}

	private async execute(
		data: Places.dto.DeleteInput,
	): Promise<Places.dto.DeleteOutput> {
		const [deleted] = await this.db
			.delete(schema.places)
			.where(eq(schema.places.id, data.id))
			.returning();

		invariant(deleted, 'NOT_FOUND', `Place with ID ${data.id} not found`);

		return {};
	}
}
