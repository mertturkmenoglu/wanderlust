import { ORPCError } from '@orpc/server';
import { $includes, schema } from '@wanderlust/db';
import { and, eq } from 'drizzle-orm';
import { injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import type { DbOrTx } from '@/lib/transactions';

@injectable()
export class InviteProvider {
	public async find({
		userId,
		inviteId,
		tripId,
		tx,
	}: {
		userId: string;
		inviteId: string;
		tripId: string;
		tx: DbOrTx;
	}) {
		const result = await tx.query.tripInvites.findFirst({
			where: {
				id: inviteId,
				toId: userId,
			},
			with: $includes.tripInviteDetails.with,
		});

		invariant(
			result,
			'NOT_FOUND',
			`Invite with id ${inviteId} not found for user with id ${userId}`,
		);

		const { fromUser, toUser, ...inv } = result;

		const invite = {
			...inv,
			from: fromUser,
			to: toUser,
		};

		const canAccess = invite.toId === userId;

		invariant(
			canAccess,
			'FORBIDDEN',
			'User is not allowed to access this invite',
		);

		if (invite.expiresAt.getTime() < Date.now()) {
			const res = await tx
				.delete(schema.tripInvites)
				.where(
					and(
						eq(schema.tripInvites.id, inviteId),
						eq(schema.tripInvites.tripId, tripId),
					),
				);

			invariant(res.rowCount === 1, 'NOT_FOUND', 'Trip invite not found');

			throw new ORPCError('GONE', {
				message: 'Invite has expired',
				status: 410,
			});
		}

		return {
			invite,
		};
	}
}
