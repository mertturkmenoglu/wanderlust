import { Tokens, Types } from '@wanderlust/common';
import type { Reviews } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { requireAuth } from '@/middlewares/authn';
import { os } from '../shared/router';

@injectable()
export class ListReviewLikesMethod {
	constructor(@inject(Tokens.Database) private readonly db: DatabaseService) {}

	route() {
		return os.listLikes.use(requireAuth).handler(async ({ input }) => {
			const result = await this.execute(input);

			return result;
		});
	}

	private async execute(
		data: Reviews.dto.ListLikesInput,
	): Promise<Reviews.dto.ListLikesOutput> {
		const offset = Types.Pagination.getOffset(data);

		const result = await this.db.query.reviewLikes.findMany({
			where: {
				reviewId: data.id,
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
			orderBy: {
				createdAt: 'desc',
			},
			offset,
			limit: data.pageSize,
		});

		const totalRecords = await this.db.$count(
			schema.reviewLikes,
			eq(schema.reviewLikes.reviewId, data.id),
		);

		return {
			users: result.map((like) => like.user),
			pagination: Types.Pagination.compute(data, totalRecords),
		};
	}
}
