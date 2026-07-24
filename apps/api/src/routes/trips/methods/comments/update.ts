import { Tokens } from '@wanderlust/common';
import type { Trips } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { CommentProvider } from '../../provides/comment';
import { canUpdateComment } from '../../shared/authz';
import { os } from '../../shared/router';

@injectable()
export class UpdateCommentMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(CommentProvider) private readonly provider: CommentProvider,
	) {}

	route() {
		return os.comments.update.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Trips.dto.UpdateCommentInput,
	): Promise<Trips.dto.UpdateCommentOutput> {
		const { comment } = await this.provider.find({
			id: data.commentId,
			userId,
			tx: this.db,
		});

		invariant(
			canUpdateComment(comment, userId),
			'FORBIDDEN',
			'User is not allowed to update this comment',
		);

		const [updated] = await this.db
			.update(schema.tripComments)
			.set({
				content: data.content,
			})
			.where(
				and(
					eq(schema.tripComments.id, data.commentId),
					eq(schema.tripComments.userId, userId),
				),
			)
			.returning();

		invariant(
			updated,
			'NOT_FOUND',
			`Comment with id ${data.commentId} not found or user is not the author`,
		);

		return {
			comment: updated,
		};
	}
}
