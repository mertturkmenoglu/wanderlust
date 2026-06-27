import { Pagination } from '@wanderlust/common';
import type { trips as dto } from '@wanderlust/contract';
import * as schema from '@wanderlust/db';
import {
	$includes,
	DatabaseService,
	type TDatabaseService,
} from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import { and, count, desc, eq, gt, lt, ne, or } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { attachFavoriteMetadata } from '@/lib/attach-favorites';
import { invariant } from '@/lib/invariant';
import type { Tx } from '@/lib/transactions';
import { FavoritesRepository } from '../favorites/repository';

@injectable()
export class TripsRepository {
	private readonly db: TDatabaseService;

	constructor(
		@inject(DatabaseService) db: DatabaseService,
		@inject(FavoritesRepository)
		private readonly favoritesRepo: FavoritesRepository,
	) {
		this.db = db.get();
	}

	async get(userId: string, data: dto.GetInput, options?: { tx?: Tx }) {
		const db = options?.tx ?? this.db;

		const res = await db.query.trips.findFirst({
			where: (t, { eq }) => eq(t.id, data.id),
			with: $includes.trip,
		});

		invariant(res, 'NOT_FOUND', `Trip with id ${data.id} not found`);

		const placeIds = Array.from(new Set(res.locations.map((l) => l.placeId)));

		const favoriteIds = await this.favoritesRepo.getFavoriteStatuses(
			userId,
			placeIds,
		);

		return {
			...res,
			locations: attachFavoriteMetadata(res.locations, favoriteIds),
		};
	}

	async listInvites(_userId: string, data: dto.ListInvitesInput) {
		const result = await this.db.query.tripInvites.findMany({
			where: (t, { eq }) => eq(t.tripId, data.id),
			with: $includes.tripInvite,
		});

		return result;
	}

	async createInvite(
		userId: string,
		data: dto.CreateInviteInput,
		tripTitle: string,
	) {
		const result = await this.db.transaction(async (tx) => {
			const inv = await tx.query.tripInvites.findFirst({
				where: (t, { and, eq }) =>
					and(eq(t.tripId, data.id), eq(t.toId, data.toUserId)),
			});

			invariant(
				!inv,
				'CONFLICT',
				`Invite already exists for user with id ${data.toUserId} to trip with id ${data.id}`,
			);

			const now = new Date();

			const [newInv] = await tx
				.insert(schema.tripInvites)
				.values({
					id: nanoid(),
					fromId: userId,
					tripId: data.id,
					toId: data.toUserId,
					tripTitle: tripTitle,
					sentAt: now,
					expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days later
					role: data.role,
				})
				.returning();

			invariant(
				newInv,
				'INTERNAL_SERVER_ERROR',
				'Failed to get invite after creation',
			);

			const invite = await tx.query.tripInvites.findFirst({
				where: (t, { eq }) => eq(t.id, newInv.id),
				with: $includes.tripInvite,
			});

			invariant(
				invite,
				'INTERNAL_SERVER_ERROR',
				'Failed to retrieve invite after creation',
			);

			return invite;
		});

		return result;
	}

	async list(userId: string, data: dto.ListInput) {
		const offset = Pagination.getOffset(data);

		const idsResult = await this.db
			.select({
				id: schema.trips.id,
			})
			.from(schema.trips)
			.leftJoin(
				schema.tripParticipants,
				eq(schema.tripParticipants.tripId, schema.trips.id),
			)
			.where(
				or(
					eq(schema.trips.ownerId, userId),
					eq(schema.tripParticipants.userId, userId),
				),
			)
			.orderBy(desc(schema.trips.createdAt))
			.offset(offset)
			.limit(data.pageSize);

		// Get unique trip ids
		const ids = Array.from(new Set(idsResult.map((r) => r.id)));

		const trips = await this.db.query.trips.findMany({
			where: (t, { inArray }) => inArray(t.id, ids),
			with: $includes.trip,
			orderBy: (t, { desc }) => [desc(t.createdAt)],
		});

		const [countResult] = await this.db
			.select({
				count: count(),
			})
			.from(schema.trips)
			.leftJoin(
				schema.tripParticipants,
				eq(schema.tripParticipants.tripId, schema.trips.id),
			)
			.where(
				or(
					eq(schema.trips.ownerId, userId),
					eq(schema.tripParticipants.userId, userId),
				),
			);

		invariant(
			countResult,
			'INTERNAL_SERVER_ERROR',
			'Failed to retrieve trips count',
		);

		const totalRecords = countResult.count;

		return {
			trips,
			pagination: Pagination.compute(data, totalRecords),
		};
	}

	async listMyInvites(userId: string, data: dto.ListMyInvitesInput) {
		const offset = Pagination.getOffset(data);

		const result = await this.db.query.tripInvites.findMany({
			where: (t, { eq }) => eq(t.toId, userId),
			offset: offset,
			limit: data.pageSize,
			orderBy: (t, { desc }) => [desc(t.sentAt)],
			with: $includes.tripInvite,
		});

		const totalRecords = await this.db.$count(
			schema.tripInvites,
			eq(schema.tripInvites.toId, userId),
		);

		return {
			invites: result,
			pagination: Pagination.compute(data, totalRecords),
		};
	}

	async create(userId: string, data: dto.CreateInput) {
		const result = await this.db.transaction(async (tx) => {
			const [newTrip] = await tx
				.insert(schema.trips)
				.values({
					id: nanoid(),
					ownerId: userId,
					title: data.title,
					description: data.description,
					visibilityLevel: data.visibilityLevel,
					startAt: data.startAt,
					endAt: data.endAt,
					requestedAmenities: [],
				})
				.returning();

			invariant(
				newTrip,
				'INTERNAL_SERVER_ERROR',
				'Failed to get trip after creation',
			);

			const trip = await this.get(userId, { id: newTrip.id }, { tx });

			invariant(
				trip,
				'INTERNAL_SERVER_ERROR',
				'Failed to retrieve trip after creation',
			);

			return trip;
		});

		return result;
	}

	async getInviteDetails(userId: string, data: dto.GetInviteDetailsInput) {
		const result = await this.db.query.tripInvites.findFirst({
			where: (t, { eq, and }) =>
				and(eq(t.id, data.inviteId), eq(t.toId, userId)),
			with: $includes.tripInviteDetails,
		});

		invariant(
			result,
			'NOT_FOUND',
			`Invite with id ${data.inviteId} not found for user with id ${userId}`,
		);

		return result;
	}

	async acceptOrDeclineInvite(
		userId: string,
		data: dto.AcceptOrDeclineInviteInput,
		role: 'member' | 'editor',
	) {
		return await this.db.transaction(async (tx) => {
			// Whether the invite is accepted or declined, delete the invite
			const deleteInviteResult = await tx
				.delete(schema.tripInvites)
				.where(eq(schema.tripInvites.id, data.inviteId));

			invariant(
				deleteInviteResult.rowCount === 1,
				'INTERNAL_SERVER_ERROR',
				'Failed to delete invite on acceptance',
			);

			// If accepted, add the user as a participant
			// Else, do nothing
			if (data.accept) {
				await tx
					.insert(schema.tripParticipants)
					.values({
						id: nanoid(),
						tripId: data.id,
						userId: userId,
						role: role,
					})
					.returning();
			}

			return data.accept;
		});
	}

	async leave(userId: string, data: dto.LeaveInput) {
		const res = await this.db
			.delete(schema.tripParticipants)
			.where(
				and(
					eq(schema.tripParticipants.tripId, data.id),
					eq(schema.tripParticipants.userId, userId),
				),
			);

		invariant(res.rowCount === 1, 'NOT_FOUND', 'Trip participant not found');
	}

	async deleteInvite(_userId: string, data: dto.DeleteInviteInput) {
		const res = await this.db
			.delete(schema.tripInvites)
			.where(
				and(
					eq(schema.tripInvites.id, data.inviteId),
					eq(schema.tripInvites.tripId, data.id),
				),
			);

		invariant(res.rowCount === 1, 'NOT_FOUND', 'Trip invite not found');
	}

	async _delete(userId: string, data: dto.DeleteInput) {
		const res = await this.db
			.delete(schema.trips)
			.where(
				and(eq(schema.trips.id, data.id), eq(schema.trips.ownerId, userId)),
			);

		invariant(
			res.rowCount === 1,
			'NOT_FOUND',
			'Trip not found or user is not the owner',
		);
	}

	async deleteParticipant(_userId: string, data: dto.DeleteParticipantInput) {
		const res = await this.db
			.delete(schema.tripParticipants)
			.where(
				and(
					eq(schema.tripParticipants.tripId, data.id),
					eq(schema.tripParticipants.userId, data.userId),
				),
			);

		invariant(res.rowCount === 1, 'NOT_FOUND', 'Trip participant not found');
	}

	async createComment(userId: string, data: dto.CreateCommentInput) {
		const [result] = await this.db
			.insert(schema.tripComments)
			.values({
				id: nanoid(),
				tripId: data.id,
				userId: userId,
				content: data.content,
				createdAt: new Date(),
			})
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'Failed to create comment');

		return result;
	}

	async listComments(_userId: string, data: dto.ListCommentsInput) {
		const offset = Pagination.getOffset(data);

		const result = await this.db.query.tripComments.findMany({
			where: (t, { eq }) => eq(t.tripId, data.id),
			orderBy: (t, { desc }) => [desc(t.createdAt)],
			offset: offset,
			limit: data.pageSize,
			with: $includes.tripComment,
		});

		const totalRecords = await this.db.$count(
			schema.tripComments,
			eq(schema.tripComments.tripId, data.id),
		);

		return {
			comments: result,
			pagination: Pagination.compute(data, totalRecords),
		};
	}

	async countComments(tripId: string): Promise<number> {
		const count = await this.db.$count(
			schema.tripComments,
			eq(schema.tripComments.tripId, tripId),
		);

		return count;
	}

	async getComment(commentId: string) {
		const result = await this.db.query.tripComments.findFirst({
			where: (t, { eq }) => eq(t.id, commentId),
			with: $includes.tripComment,
		});

		invariant(result, 'NOT_FOUND', `Comment with id ${commentId} not found`);

		return result;
	}

	async updateComment(userId: string, data: dto.UpdateCommentInput) {
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

		return updated;
	}

	async deleteComment(_userId: string, data: dto.DeleteCommentInput) {
		const res = await this.db
			.delete(schema.tripComments)
			.where(eq(schema.tripComments.id, data.commentId));

		invariant(
			res.rowCount === 1,
			'NOT_FOUND',
			`Comment with id ${data.commentId} not found`,
		);
	}

	async update(userId: string, data: dto.UpdateInput) {
		const existing = await this.get(userId, { id: data.id });

		let isDateChanged = false;

		if (data.startAt.getTime() !== existing.startAt.getTime()) {
			isDateChanged = true;
		}

		if (data.endAt.getTime() !== existing.endAt.getTime()) {
			isDateChanged = true;
		}

		await this.db.transaction(async (tx) => {
			// Update trip
			await tx
				.update(schema.trips)
				.set({
					title: data.title,
					description: data.description,
					visibilityLevel: data.visibilityLevel,
					startAt: data.startAt,
					endAt: data.endAt,
				})
				.where(eq(schema.trips.id, data.id));

			// If date changed, there could be dangling location entities
			// Move them into the new trip date range
			if (isDateChanged) {
				// If the location scheduled time is before the new start date
				// or after the new end date, set it to the new start date
				await tx
					.update(schema.tripLocations)
					.set({
						scheduledTime: data.startAt,
					})
					.where(
						and(
							eq(schema.tripLocations.tripId, data.id),
							or(
								lt(schema.tripLocations.scheduledTime, data.startAt),
								gt(schema.tripLocations.scheduledTime, data.endAt),
							),
						),
					);
			}

			// If the visibility level is changed to private,
			// there can't be any pending invites
			// there can't be any participants other than the owner
			// there can't be any comments (because their owners won't have access anymore)
			if (data.visibilityLevel === 'private') {
				// Remove all participants
				await tx
					.delete(schema.tripParticipants)
					.where(eq(schema.tripParticipants.tripId, data.id));

				// Remove all invites
				await tx
					.delete(schema.tripInvites)
					.where(eq(schema.tripInvites.tripId, data.id));

				// Remove all comments where the trip id matches and the comment user id is not the owner
				await tx
					.delete(schema.tripComments)
					.where(
						and(
							eq(schema.tripComments.tripId, data.id),
							ne(schema.tripComments.userId, userId),
						),
					);
			}
		});

		const updated = await this.get(userId, { id: data.id });

		return [updated, isDateChanged] as const;
	}

	async createLocation(userId: string, data: dto.CreateLocationInput) {
		const place = await this.db.query.places.findFirst({
			where: (p, { eq }) => eq(p.id, data.placeId),
		});

		invariant(place, 'NOT_FOUND', `Place with id ${data.placeId} not found`);

		const existing = await this.db.query.tripLocations.findFirst({
			where: (t, { and, eq }) =>
				and(eq(t.tripId, data.id), eq(t.placeId, data.placeId)),
		});

		invariant(
			!existing,
			'CONFLICT',
			`Location with place id ${data.placeId} already exists in trip with id ${data.id}`,
		);

		const [newLocation] = await this.db
			.insert(schema.tripLocations)
			.values({
				id: nanoid(),
				tripId: data.id,
				placeId: data.placeId,
				scheduledTime: data.scheduledTime,
				description: data.description ?? '',
			})
			.returning();

		invariant(
			newLocation,
			'INTERNAL_SERVER_ERROR',
			'Failed to create trip location',
		);

		const location = await this.getLocation(userId, newLocation.id);

		return location;
	}

	async getLocation(userId: string, id: string) {
		const location = await this.db.query.tripLocations.findFirst({
			where: (t, { eq }) => eq(t.id, id),
			with: {
				place: {
					with: $includes.place,
				},
			},
		});

		invariant(location, 'NOT_FOUND', `Location with id ${id} not found`);

		const favoriteIds = await this.favoritesRepo.getFavoriteStatuses(userId, [
			location.placeId,
		]);

		return {
			...location,
			meta: {
				isFavorite: favoriteIds.includes(location.placeId),
			},
		};
	}

	async updateLocation(userId: string, data: dto.UpdateLocationInput) {
		const res = await this.db
			.update(schema.tripLocations)
			.set({
				scheduledTime: data.scheduledTime,
				description: data.description,
			})
			.where(
				and(
					eq(schema.tripLocations.id, data.locationId),
					eq(schema.tripLocations.tripId, data.id),
				),
			)
			.returning();

		invariant(
			res.length !== 0,
			'NOT_FOUND',
			`Trip location with id ${data.locationId} not found`,
		);

		const updatedLocation = await this.getLocation(userId, data.locationId);

		return updatedLocation;
	}

	async deleteLocation(_userId: string, data: dto.DeleteLocationInput) {
		const res = await this.db
			.delete(schema.tripLocations)
			.where(
				and(
					eq(schema.tripLocations.id, data.locationId),
					eq(schema.tripLocations.tripId, data.id),
				),
			);

		invariant(
			res.rowCount === 1,
			'NOT_FOUND',
			`Trip location with id ${data.locationId} not found`,
		);
	}

	async updateRequestedAmenities(
		userId: string,
		data: dto.UpdateRequestedAmenitiesInput,
	) {
		const [updated] = await this.db
			.update(schema.trips)
			.set({
				requestedAmenities: data.amenities,
			})
			.where(and(eq(schema.trips.id, data.id)))
			.returning();

		invariant(updated, 'NOT_FOUND', `Trip with id ${data.id} not found`);

		const result = await this.get(userId, { id: data.id });

		return result;
	}
}
