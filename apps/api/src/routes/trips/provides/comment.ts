import { $includes } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import type { DbOrTx } from '@/lib/transactions';
import { canReadComment } from '../shared/authz';
import { TripProvider } from './trip';

@injectable()
export class CommentProvider {
	constructor(
		@inject(TripProvider) private readonly tripProvider: TripProvider,
	) {}

	public async find({
		id,
		userId,
		tx,
	}: {
		id: string;
		userId: string;
		tx: DbOrTx;
	}) {
		const result = await tx.query.tripComments.findFirst({
			where: {
				id: id,
			},
			with: $includes.tripComment.with,
		});

		invariant(result, 'NOT_FOUND', `Comment with id ${id} not found`);

		const { trip } = await this.tripProvider.find({
			id: result.tripId,
			userId,
			tx,
		});

		invariant(
			canReadComment(trip, userId),
			'FORBIDDEN',
			'User is not allowed to read this comment',
		);

		return {
			comment: result,
			trip,
		};
	}
}
