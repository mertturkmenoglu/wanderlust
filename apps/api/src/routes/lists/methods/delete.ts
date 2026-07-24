import { Tokens } from '@wanderlust/common';
import type { Lists } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { canDelete } from '../shared/authz';
import { os } from '../shared/router';

@injectable()
export class DeleteListMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.delete.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Lists.dto.DeleteInput,
	): Promise<Lists.dto.DeleteOutput> {
		const existing = await this.db.query.lists.findFirst({
			where: {
				id: data.id,
			},
		});

		invariant(existing, 'NOT_FOUND', `List with ID '${data.id}' not found`);

		const hasDeletePermission = canDelete(existing, userId);

		invariant(
			hasDeletePermission,
			'FORBIDDEN',
			'You do not have permission to delete this list',
		);

		await this.db.delete(schema.lists).where(eq(schema.lists.id, data.id));

		return {};
	}
}
