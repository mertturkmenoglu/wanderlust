import { Tokens } from '@wanderlust/common';
import type { Lists } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { canUpdate } from '../shared/authz';
import { os } from '../shared/router';

@injectable()
export class UpdateListMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.update.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Lists.dto.UpdateInput,
	): Promise<Lists.dto.UpdateOutput> {
		const existing = await this.db.query.lists.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(existing, 'NOT_FOUND', `List with ID '${data.id}' not found`);

		const hasUpdatePermission = canUpdate(existing, userId);

		invariant(
			hasUpdatePermission,
			'FORBIDDEN',
			'You do not have permission to update this list',
		);

		const [updated] = await this.db
			.update(schema.lists)
			.set({
				name: data.name,
				isPublic: data.isPublic,
			})
			.where(eq(schema.lists.id, data.id))
			.returning();

		invariant(updated, 'INTERNAL_SERVER_ERROR', 'No list returned');

		const list = await this.db.query.lists.findFirst({
			where: {
				id: updated.id,
			},
			with: {
				user: {
					columns: {
						id: true,
						username: true,
						name: true,
						image: true,
					},
				},
			},
		});

		invariant(
			list,
			'INTERNAL_SERVER_ERROR',
			'Failed to retrieve the updated list',
		);

		return {
			list,
		};
	}
}
