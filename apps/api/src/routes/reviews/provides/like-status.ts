import { injectable } from 'inversify';
import type { DbOrTx } from '@/lib/transactions';
import { unique } from '@/lib/unique';

@injectable()
export class LikeStatusProvider {
	async getLikedStatuses(deps: {
		tx: DbOrTx;
		userId: string | null;
		ids: string[];
	}) {
		if (!deps.userId) {
			return [];
		}

		const result = await deps.tx.query.reviewLikes.findMany({
			columns: {
				reviewId: true,
			},
			where: {
				userId: deps.userId,
				reviewId: {
					in: deps.ids,
				},
			},
		});

		return unique(result.map((r) => r.reviewId));
	}
}
