import { Tokens, Types } from '@wanderlust/common';
import type { Reviews } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserId } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { LikeStatusProvider } from '../provides/like-status';
import { os } from '../shared/router';
import { countByPlaceId } from '../statements';

@injectable()
export class ListReviewsByPlaceIdMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(LikeStatusProvider)
		private readonly likeStatusProvider: LikeStatusProvider,
	) {}

	route() {
		return os.listByPlaceId.handler(async ({ input, context }) => {
			const userId = getUserId(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string | null,
		data: Reviews.dto.ListByPlaceIdInput,
	): Promise<Reviews.dto.ListByPlaceIdOutput> {
		const offset = Types.Pagination.getOffset(data);
		const min = data.minRating || 0;
		const max = data.maxRating || 5;
		let sortBy = data.sortBy || 'createdAt';

		if (data.sortBy === 'created_at') {
			sortBy = 'createdAt';
		} else if (data.sortBy === 'rating') {
			sortBy = 'rating';
		} else if (data.sortBy === 'likes') {
			sortBy = 'totalLikes';
		}

		const sortOrd = data.sortOrd || 'desc';

		const result = await this.db.query.reviews.findMany({
			where: {
				placeId: data.id,
				rating: {
					gte: min,
					lte: max,
				},
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
				assets: true,
			},
			orderBy: {
				[sortBy]: sortOrd,
			},
			offset,
			limit: data.pageSize,
		});

		const [total] = await countByPlaceId.execute(this.db, {
			placeId: data.id,
			minRating: min,
			maxRating: max,
		});

		invariant(total, 'INTERNAL_SERVER_ERROR', 'Failed to count reviews');

		const totalRecords = total.count;

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
