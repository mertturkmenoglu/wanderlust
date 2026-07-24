import { Tokens } from '@wanderlust/common';
import type { Reviews } from '@wanderlust/contract';
import { $includes, type DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { getUserId } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { LikeStatusProvider } from '../provides/like-status';
import { os } from '../shared/router';

@injectable()
export class GetReviewMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(LikeStatusProvider)
		private readonly likeStatusProvider: LikeStatusProvider,
	) {}

	route() {
		return os.get.handler(async ({ input, context }) => {
			const userId = getUserId(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string | null,
		data: Reviews.dto.GetInput,
	): Promise<Reviews.dto.GetOutput> {
		const result = await this.db.query.reviews.findFirst({
			where: {
				id: data.id,
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
		});

		invariant(result, 'NOT_FOUND', `Review with id ${data.id} not found`);

		const likes = await this.likeStatusProvider.getLikedStatuses({
			userId,
			ids: [result.id],
			tx: this.db,
		});

		return {
			review: result,
			meta: {
				isLiked: likes.includes(result.id),
			},
		};
	}
}
