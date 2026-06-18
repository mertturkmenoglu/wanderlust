import { ORPCError } from '@orpc/client';
import { Pagination } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import { DatabaseService, type TDatabaseService } from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import { and, count, desc, eq, gt, lt, ne, or } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { FavoritesRepository } from '../favorites/repository';
import type * as dto from './dto';

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

	async get(userId: string, data: dto.GetInput) {
		try {
			const res = await this.db.query.trips.findFirst({
				where: (t, { eq }) => eq(t.id, data.id),
				with: {
					participants: {
						orderBy: (t, { desc }) => [desc(t.id)],
						with: {
							user: {
								columns: {
									id: true,
									name: true,
									username: true,
									image: true,
								},
							},
						},
					},
					owner: {
						columns: {
							id: true,
							name: true,
							username: true,
							image: true,
						},
					},
					locations: {
						orderBy: (t, { asc }) => [asc(t.scheduledTime)],
						with: {
							place: {
								with: {
									assets: true,
									category: true,
									address: {
										with: {
											city: true,
										},
									},
									accolades: {
										with: {
											accolade: true,
										},
									},
								},
							},
						},
					},
				},
			});

			if (!res) {
				throw new ORPCError('NOT_FOUND', {
					message: `Trip with id ${data.id} not found`,
				});
			}

			const placeIds = Array.from(new Set(res.locations.map((l) => l.placeId)));

			const favoriteStatuses = userId
				? await this.favoritesRepo.getFavoriteStatuses(userId, placeIds)
				: [];

			const locationsWithMeta = res.locations.map((loc) => ({
				...loc,
				meta: {
					isFavorite: favoriteStatuses.includes(loc.placeId),
				},
			}));

			return {
				...res,
				locations: locationsWithMeta,
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to retrieve trip',
				cause: err,
			});
		}
	}

	async listInvites(_userId: string, data: dto.ListInvitesInput) {
		try {
			const result = await this.db.query.tripInvites.findMany({
				where: (t, { eq }) => eq(t.tripId, data.id),
				with: {
					fromUser: {
						columns: {
							id: true,
							name: true,
							username: true,
							image: true,
						},
					},
					toUser: {
						columns: {
							id: true,
							name: true,
							username: true,
							image: true,
						},
					},
				},
			});

			return result;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to list trip invites',
				cause: err,
			});
		}
	}

	async createInvite(
		userId: string,
		data: dto.CreateInviteInput,
		tripTitle: string,
	) {
		try {
			const result = await this.db.transaction(async (tx) => {
				const inv = await tx.query.tripInvites.findFirst({
					where: (t, { and, eq }) =>
						and(eq(t.tripId, data.id), eq(t.toId, data.toUserId)),
				});

				if (inv) {
					throw new ORPCError('CONFLICT', {
						message: `Invite already exists for user with id ${data.toUserId} to trip with id ${data.id}`,
					});
				}

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

				if (!newInv) {
					throw new ORPCError('INTERNAL_SERVER_ERROR', {
						message: 'Failed to get invite after creation',
					});
				}

				const invite = await tx.query.tripInvites.findFirst({
					where: (t, { eq }) => eq(t.id, newInv.id),
					with: {
						fromUser: {
							columns: {
								id: true,
								name: true,
								username: true,
								image: true,
							},
						},
						toUser: {
							columns: {
								id: true,
								name: true,
								username: true,
								image: true,
							},
						},
					},
				});

				if (!invite) {
					throw new ORPCError('INTERNAL_SERVER_ERROR', {
						message: 'Failed to retrieve invite after creation',
					});
				}

				return invite;
			});

			return result;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create trip invite',
				cause: err,
			});
		}
	}

	async list(userId: string, data: dto.ListInput) {
		const offset = Pagination.getOffset(data);

		try {
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
				with: {
					participants: {
						orderBy: (t, { desc }) => [desc(t.id)],
						with: {
							user: {
								columns: {
									id: true,
									name: true,
									username: true,
									image: true,
								},
							},
						},
					},
					owner: {
						columns: {
							id: true,
							name: true,
							username: true,
							image: true,
						},
					},
					locations: {
						orderBy: (t, { asc }) => [asc(t.scheduledTime)],
						with: {
							place: {
								with: {
									assets: true,
									category: true,
									address: {
										with: {
											city: true,
										},
									},
								},
							},
						},
					},
				},
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

			if (!countResult) {
				throw new ORPCError('INTERNAL_SERVER_ERROR', {
					message: 'Failed to retrieve trips count',
				});
			}

			const totalRecords = countResult.count;

			return {
				trips,
				pagination: Pagination.compute(data, totalRecords),
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to list trips',
				cause: err,
			});
		}
	}

	async listMyInvites(userId: string, data: dto.ListMyInvitesInput) {
		const offset = Pagination.getOffset(data);

		try {
			const result = await this.db.query.tripInvites.findMany({
				where: (t, { eq }) => eq(t.toId, userId),
				offset: offset,
				limit: data.pageSize,
				orderBy: (t, { desc }) => [desc(t.sentAt)],
				with: {
					fromUser: {
						columns: {
							id: true,
							name: true,
							username: true,
							image: true,
						},
					},
					toUser: {
						columns: {
							id: true,
							name: true,
							username: true,
							image: true,
						},
					},
				},
			});

			const totalRecords = await this.db.$count(
				schema.tripInvites,
				eq(schema.tripInvites.toId, userId),
			);

			return {
				invites: result,
				pagination: Pagination.compute(data, totalRecords),
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to list trip invites',
				cause: err,
			});
		}
	}

	async create(userId: string, data: dto.CreateInput) {
		try {
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

				if (!newTrip) {
					throw new ORPCError('INTERNAL_SERVER_ERROR', {
						message: 'Failed to get trip after creation',
					});
				}

				const trip = await this.get(userId, { id: newTrip.id });

				if (!trip) {
					throw new ORPCError('INTERNAL_SERVER_ERROR', {
						message: 'Failed to retrieve trip after creation',
					});
				}

				return trip;
			});

			return result;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create trip',
				cause: err,
			});
		}
	}

	async getInviteDetails(userId: string, data: dto.GetInviteDetailsInput) {
		try {
			const result = await this.db.query.tripInvites.findFirst({
				where: (t, { eq, and }) =>
					and(eq(t.id, data.inviteId), eq(t.toId, userId)),
				with: {
					fromUser: {
						columns: {
							id: true,
							name: true,
							username: true,
							image: true,
						},
					},
					toUser: {
						columns: {
							id: true,
							name: true,
							username: true,
							image: true,
						},
					},
					trip: {
						columns: {
							requestedAmenities: false,
							visibilityLevel: false,
							description: false,
						},
						with: {
							owner: {
								columns: {
									id: true,
									name: true,
									username: true,
									image: true,
								},
							},
						},
					},
				},
			});

			if (!result) {
				throw new ORPCError('NOT_FOUND', {
					message: `Invite with id ${data.id} not found for user with id ${userId}`,
				});
			}

			return result;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to retrieve invite details',
				cause: err,
			});
		}
	}

	async acceptOrDeclineInvite(
		userId: string,
		data: dto.AcceptOrDeclineInviteInput,
		role: 'member' | 'editor',
	) {
		try {
			return await this.db.transaction(async (tx) => {
				// Whether the invite is accepted or declined, delete the invite
				const deleteInviteResult = await tx
					.delete(schema.tripInvites)
					.where(eq(schema.tripInvites.id, data.inviteId));

				if (deleteInviteResult.rowCount === 0) {
					throw new ORPCError('INTERNAL_SERVER_ERROR', {
						message: 'Failed to delete invite on acceptance',
					});
				}

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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to accept or decline invite',
				cause: err,
			});
		}
	}

	async leave(userId: string, data: dto.LeaveInput) {
		try {
			const res = await this.db
				.delete(schema.tripParticipants)
				.where(
					and(
						eq(schema.tripParticipants.tripId, data.id),
						eq(schema.tripParticipants.userId, userId),
					),
				);

			if (res.rowCount === 0) {
				throw new ORPCError('NOT_FOUND', {
					message: 'Trip participant not found',
				});
			}
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to leave trip',
				cause: err,
			});
		}
	}

	async deleteInvite(_userId: string, data: dto.DeleteInviteInput) {
		try {
			const res = await this.db
				.delete(schema.tripInvites)
				.where(
					and(
						eq(schema.tripInvites.id, data.inviteId),
						eq(schema.tripInvites.tripId, data.id),
					),
				);

			if (res.rowCount === 0) {
				throw new ORPCError('NOT_FOUND', {
					message: 'Trip invite not found',
				});
			}
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to delete trip invite',
				cause: err,
			});
		}
	}

	async _delete(userId: string, data: dto.DeleteInput) {
		try {
			const res = await this.db
				.delete(schema.trips)
				.where(
					and(eq(schema.trips.id, data.id), eq(schema.trips.ownerId, userId)),
				);

			if (res.rowCount === 0) {
				throw new ORPCError('NOT_FOUND', {
					message: 'Trip not found or user is not the owner',
				});
			}
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to delete trip',
				cause: err,
			});
		}
	}

	async deleteParticipant(_userId: string, data: dto.DeleteParticipantInput) {
		try {
			const res = await this.db
				.delete(schema.tripParticipants)
				.where(
					and(
						eq(schema.tripParticipants.tripId, data.id),
						eq(schema.tripParticipants.userId, data.userId),
					),
				);

			if (res.rowCount === 0) {
				throw new ORPCError('NOT_FOUND', {
					message: 'Trip participant not found',
				});
			}
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to delete trip participant',
				cause: err,
			});
		}
	}

	async createComment(userId: string, data: dto.CreateCommentInput) {
		try {
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

			if (!result) {
				throw new ORPCError('INTERNAL_SERVER_ERROR', {
					message: 'Failed to create comment',
				});
			}

			return result;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create trip comment',
				cause: err,
			});
		}
	}

	async listComments(_userId: string, data: dto.ListCommentsInput) {
		const offset = Pagination.getOffset(data);

		try {
			const result = await this.db.query.tripComments.findMany({
				where: (t, { eq }) => eq(t.tripId, data.id),
				orderBy: (t, { desc }) => [desc(t.createdAt)],
				offset: offset,
				limit: data.pageSize,
				with: {
					user: {
						columns: {
							id: true,
							name: true,
							username: true,
							image: true,
						},
					},
				},
			});

			const totalRecords = await this.db.$count(
				schema.tripComments,
				eq(schema.tripComments.tripId, data.id),
			);

			return {
				comments: result,
				pagination: Pagination.compute(data, totalRecords),
			};
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to list trip comments',
				cause: err,
			});
		}
	}

	async countComments(tripId: string): Promise<number> {
		try {
			const count = await this.db.$count(
				schema.tripComments,
				eq(schema.tripComments.tripId, tripId),
			);

			return count;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to count trip comments',
				cause: err,
			});
		}
	}

	async getComment(commentId: string) {
		try {
			const result = await this.db.query.tripComments.findFirst({
				where: (t, { eq }) => eq(t.id, commentId),
				with: {
					user: {
						columns: {
							id: true,
							name: true,
							username: true,
							image: true,
						},
					},
				},
			});

			if (!result) {
				throw new ORPCError('NOT_FOUND', {
					message: `Comment with id ${commentId} not found`,
				});
			}

			return result;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to retrieve trip comment',
				cause: err,
			});
		}
	}

	async updateComment(userId: string, data: dto.UpdateCommentInput) {
		try {
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

			if (!updated) {
				throw new ORPCError('NOT_FOUND', {
					message: `Comment with id ${data.commentId} not found or user is not the author`,
				});
			}

			return updated;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to update trip comment',
				cause: err,
			});
		}
	}

	async deleteComment(_userId: string, data: dto.DeleteCommentInput) {
		try {
			const res = await this.db
				.delete(schema.tripComments)
				.where(eq(schema.tripComments.id, data.commentId));

			if (res.rowCount === 0) {
				throw new ORPCError('NOT_FOUND', {
					message: `Comment with id ${data.commentId} not found`,
				});
			}
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to delete trip comment',
				cause: err,
			});
		}
	}

	async update(userId: string, data: dto.UpdateInput) {
		try {
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
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to update trip',
				cause: err,
			});
		}
	}

	async createLocation(userId: string, data: dto.CreateLocationInput) {
		try {
			const place = await this.db.query.places.findFirst({
				where: (p, { eq }) => eq(p.id, data.placeId),
			});

			if (!place) {
				throw new ORPCError('NOT_FOUND', {
					message: `Place with id ${data.placeId} not found`,
				});
			}

			const existing = await this.db.query.tripLocations.findFirst({
				where: (t, { and, eq }) =>
					and(eq(t.tripId, data.id), eq(t.placeId, data.placeId)),
			});

			if (existing) {
				throw new ORPCError('CONFLICT', {
					message: `Location with place id ${data.placeId} already exists in trip with id ${data.id}`,
				});
			}

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

			if (!newLocation) {
				throw new ORPCError('INTERNAL_SERVER_ERROR', {
					message: 'Failed to create trip location',
				});
			}

			const location = await this.getLocation(userId, newLocation.id);

			return location;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create trip location',
				cause: err,
			});
		}
	}

	async getLocation(userId: string, id: string) {
		try {
			const location = await this.db.query.tripLocations.findFirst({
				where: (t, { eq }) => eq(t.id, id),
				with: {
					place: {
						with: {
							assets: true,
							category: true,
							address: {
								with: {
									city: true,
								},
							},
							accolades: {
								with: {
									accolade: true,
								},
							},
						},
					},
				},
			});

			if (!location) {
				throw new ORPCError('NOT_FOUND', {
					message: `Location with id ${id} not found`,
				});
			}

			const favoriteStatuses = userId
				? await this.favoritesRepo.getFavoriteStatuses(userId, [location.placeId])
				: [];

			return {
				...location,
				meta: {
					isFavorite: favoriteStatuses.includes(location.placeId),
				}
			}
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to retrieve trip location',
				cause: err,
			});
		}
	}

	async updateLocation(userId: string, data: dto.UpdateLocationInput) {
		try {
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

			if (res.length === 0) {
				throw new ORPCError('NOT_FOUND', {
					message: 'Trip location not found',
				});
			}

			const updatedLocation = await this.getLocation(userId, data.locationId);

			return updatedLocation;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to update trip location',
				cause: err,
			});
		}
	}

	async deleteLocation(_userId: string, data: dto.DeleteLocationInput) {
		try {
			const res = await this.db
				.delete(schema.tripLocations)
				.where(
					and(
						eq(schema.tripLocations.id, data.locationId),
						eq(schema.tripLocations.tripId, data.id),
					),
				);

			if (res.rowCount === 0) {
				throw new ORPCError('NOT_FOUND', {
					message: 'Trip location not found',
				});
			}
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to delete trip location',
				cause: err,
			});
		}
	}

	async updateRequestedAmenities(
		userId: string,
		data: dto.UpdateRequestedAmenitiesInput,
	) {
		try {
			const [updated] = await this.db
				.update(schema.trips)
				.set({
					requestedAmenities: data.amenities,
				})
				.where(and(eq(schema.trips.id, data.id)))
				.returning();

			if (!updated) {
				throw new ORPCError('NOT_FOUND', {
					message: 'Trip not found or user is not the owner',
				});
			}

			const result = await this.get(userId, { id: data.id });

			return result;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to update requested amenities',
				cause: err,
			});
		}
	}
}
