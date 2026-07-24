import { Tokens, Types } from '@wanderlust/common';
import type { Reviews } from '@wanderlust/contract';
import { $includes, type DatabaseService, schema } from '@wanderlust/db';
import * as dz from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { getUserId } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { LikeStatusProvider } from '../provides/like-status';
import { os } from '../shared/router';

@injectable()
export class ListReviewsByUsernameMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(LikeStatusProvider)
		private readonly likeStatusProvider: LikeStatusProvider,
	) {}

	route() {
		return os.listByUsername.handler(async ({ input, context }) => {
			const userId = getUserId(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string | null,
		data: Reviews.dto.ListByUsernameInput,
	): Promise<Reviews.dto.ListByUsernameOutput> {
		const offset = Types.Pagination.getOffset(data);

		const user = await this.db.query.users.findFirst({
			where: {
				username: data.username,
			},
		});

		invariant(
			user,
			'NOT_FOUND',
			`User with username ${data.username} not found`,
		);

		const result = await this.db.query.reviews.findMany({
			where: {
				userId: user.id,
			},
			with: {
				place: $includes.place,
				user: {
					columns: {
						id: true,
						username: true,
						name: true,
						image: true,
					},
				},
				assets: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
			offset,
			limit: data.pageSize,
		});

		const totalRecords = await this.db.$count(
			schema.reviews,
			dz.eq(schema.reviews.userId, user.id),
		);

		const pagination = Types.Pagination.compute(data, totalRecords);

		const likes = await this.likeStatusProvider.getLikedStatuses({
			ids: result.map((r) => r.id),
			userId,
			tx: this.db,
		});

		return {
			reviews: result.map((review) => ({
				review: review,
				meta: {
					isLiked: likes.includes(review.id),
				},
			})),
			pagination: pagination,
		};
	}
}
