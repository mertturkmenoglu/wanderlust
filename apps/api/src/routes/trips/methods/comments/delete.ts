import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { CommentProvider } from '../../provides/comment';
import { canDeleteComment } from '../../shared/authz';
import { os } from '../../shared/router';

@injectable()
export class DeleteCommentMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(CommentProvider) private readonly provider: CommentProvider,
	) {}

	route() {
		return os.comments.delete.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.DeleteCommentInput,
	): Promise<Trips.dto.DeleteCommentOutput> {
		const { comment, trip } = await this.provider.find({
			id: data.commentId,
			userId,
			tx: this.db,
		});

		invariant(
			canDeleteComment(trip, comment, userId),
			'FORBIDDEN',
			'User is not allowed to delete this comment',
		);

		const res = await this.db
			.delete(schema.tripComments)
			.where(eq(schema.tripComments.id, data.commentId));

		invariant(
			res.rowCount === 1,
			'NOT_FOUND',
			`Comment with id ${data.commentId} not found`,
		);

		return {};
	}
}
