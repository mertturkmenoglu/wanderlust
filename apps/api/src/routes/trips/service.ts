import { ORPCError } from '@orpc/client';
import type { trips as dto } from '@wanderlust/contract';
import { JobsService, type TJobsService } from '@wanderlust/jobs';
import { nanoid } from '@wanderlust/uid';
import { eachDayOfInterval } from 'date-fns';
import { inject, injectable } from 'inversify';
import { ActivitiesService } from '@/lib/activities';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';
import * as authz from './authz';
import { TripsRepository } from './repository';

@injectable()
@TraceAll()
export class TripsService {
	private readonly jobs: TJobsService;
	private readonly activities: ActivitiesService;

	constructor(
		@inject(TripsRepository) private readonly repo: TripsRepository,
		@inject(JobsService) jobs: JobsService,
		@inject(ActivitiesService) activities: ActivitiesService,
	) {
		this.jobs = jobs.get();
		this.activities = activities;
	}

	async get(userId: string, data: dto.GetInput): Promise<dto.GetOutput> {
		const result = await this.repo.get(userId, data);

		invariant(
			authz.canRead(result, userId),
			'FORBIDDEN',
			'User is not allowed to access this trip',
		);

		return {
			trip: result,
		};
	}

	async listInvites(
		userId: string,
		data: dto.ListInvitesInput,
	): Promise<dto.ListInvitesOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		invariant(
			authz.canRead(trip, userId),
			'FORBIDDEN',
			'User is not allowed to access this trip',
		);

		const result = await this.repo.listInvites(userId, data);

		return {
			invites: result,
		};
	}

	async createInvite(
		userId: string,
		data: dto.CreateInviteInput,
	): Promise<dto.CreateInviteOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		invariant(
			authz.canRead(trip, userId),
			'FORBIDDEN',
			'User is not allowed to access this trip',
		);

		invariant(
			authz.canCreateInvite(trip, userId),
			'FORBIDDEN',
			'User is not allowed to invite participants to this trip',
		);

		invariant(
			trip.visibilityLevel !== 'private',
			'CONFLICT',
			'Cannot invite participants to private trips',
		);

		const result = await this.repo.createInvite(userId, data, trip.title);

		await this.jobs.notification.queue.add('create-notification', {
			id: nanoid(),
			entityId: trip.id,
			entityType: 'trip',
			recipientId: result.toId,
			type: 'trip_invite',
			data: {
				trip: {
					id: trip.id,
					title: trip.title,
				},
				role: result.role,
				from: result.fromUser,
			},
		});

		return {
			invite: result,
		};
	}

	async list(userId: string, data: dto.ListInput): Promise<dto.ListOutput> {
		const result = await this.repo.list(userId, data);

		return {
			trips: result.trips,
			pagination: result.pagination,
		};
	}

	async listMyInvites(
		userId: string,
		data: dto.ListMyInvitesInput,
	): Promise<dto.ListMyInvitesOutput> {
		const result = await this.repo.listMyInvites(userId, data);

		return {
			invites: result.invites,
			pagination: result.pagination,
		};
	}

	async create(
		userId: string,
		data: dto.CreateInput,
	): Promise<dto.CreateOutput> {
		invariant(
			data.startAt.getTime() < data.endAt.getTime(),
			'BAD_REQUEST',
			'Trip start date must be before end date',
		);

		invariant(
			data.startAt.getTime() > Date.now(),
			'BAD_REQUEST',
			'Trip start date must be in the future',
		);

		const result = await this.repo.create(userId, data);

		if (result.visibilityLevel === 'public') {
			await this.activities.addActivity(result.owner.username, 'create_trip', {
				trip: {
					id: result.id,
					title: result.title,
				},
			});
		}

		return {
			trip: result,
		};
	}

	async getInviteDetails(
		userId: string,
		data: dto.GetInviteDetailsInput,
	): Promise<dto.GetInviteDetailsOutput> {
		const invite = await this.repo.getInviteDetails(userId, data);

		const canAccess = invite.toId === userId;

		invariant(
			canAccess,
			'FORBIDDEN',
			'User is not allowed to access this invite',
		);

		if (invite.expiresAt.getTime() < Date.now()) {
			await this.repo.deleteInvite(userId, {
				id: data.id,
				inviteId: data.inviteId,
			});

			throw new ORPCError('GONE', {
				message: 'Invite has expired',
				status: 410,
			});
		}

		return {
			invite,
		};
	}

	async acceptOrDeclineInvite(
		userId: string,
		data: dto.AcceptOrDeclineInviteInput,
	): Promise<dto.AcceptOrDeclineInviteOutput> {
		const { invite } = await this.getInviteDetails(userId, {
			id: data.id,
			inviteId: data.inviteId,
		});

		const accepted = await this.repo.acceptOrDeclineInvite(
			userId,
			data,
			invite.role,
		);

		if (accepted) {
			await this.jobs.notification.queue.add('create-notification', {
				entityId: invite.tripId,
				entityType: 'trip',
				id: nanoid(),
				recipientId: invite.trip.ownerId,
				type: 'trip_add_user',
				data: {
					newUser: invite.toUser,
				},
			});
		}

		return {
			accepted,
		};
	}

	async leave(userId: string, data: dto.LeaveInput): Promise<dto.LeaveOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		invariant(
			authz.canRead(trip, userId),
			'FORBIDDEN',
			'User is not allowed to access this trip',
		);

		invariant(
			authz.isOwner(trip, userId) === false,
			'FORBIDDEN',
			'Owner of the trip cannot leave the trip',
		);

		await this.repo.leave(userId, data);

		return {};
	}

	async deleteInvite(
		userId: string,
		data: dto.DeleteInviteInput,
	): Promise<dto.DeleteInviteOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		invariant(
			authz.canRead(trip, userId),
			'FORBIDDEN',
			'User is not allowed to access this trip',
		);

		invariant(
			authz.canDeleteInvite(trip, userId),
			'FORBIDDEN',
			'User is not allowed to delete invites for this trip',
		);

		await this.repo.deleteInvite(userId, data);

		return {};
	}

	async _delete(
		userId: string,
		data: dto.DeleteInput,
	): Promise<dto.DeleteOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		invariant(
			authz.canRead(trip, userId),
			'FORBIDDEN',
			'User is not allowed to access this trip',
		);

		invariant(
			authz.canDeleteTrip(trip, userId),
			'FORBIDDEN',
			'Only the owner can delete the trip',
		);

		await this.repo._delete(userId, data);

		return {};
	}

	async deleteParticipant(
		userId: string,
		data: dto.DeleteParticipantInput,
	): Promise<dto.DeleteParticipantOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		invariant(
			authz.canRead(trip, userId),
			'FORBIDDEN',
			'User is not allowed to access this trip',
		);

		invariant(
			authz.canDeleteParticipant(trip, userId, data.userId),
			'FORBIDDEN',
			'User is not allowed to remove this participant from the trip',
		);

		await this.repo.deleteParticipant(userId, data);

		return {};
	}

	async createComment(
		userId: string,
		data: dto.CreateCommentInput,
	): Promise<dto.CreateCommentOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		invariant(
			authz.canRead(trip, userId),
			'FORBIDDEN',
			'User is not allowed to access this trip',
		);

		invariant(
			authz.canCreateComment(trip, userId),
			'FORBIDDEN',
			'User is not allowed to create comments on this trip',
		);

		const result = await this.repo.createComment(userId, data);

		if (result.userId !== trip.ownerId) {
			await this.jobs.notification.queue.add('create-notification', {
				entityId: trip.id,
				entityType: 'trip',
				id: nanoid(),
				recipientId: trip.ownerId,
				type: 'trip_add_comment',
				data: {
					trip: {
						id: trip.id,
						title: trip.title,
					},
				},
			});
		}

		return {
			comment: result,
		};
	}

	async listComments(
		userId: string,
		data: dto.ListCommentsInput,
	): Promise<dto.ListCommentsOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		invariant(
			authz.canRead(trip, userId),
			'FORBIDDEN',
			'User is not allowed to access this trip',
		);

		invariant(
			authz.canReadComment(trip, userId),
			'FORBIDDEN',
			'User is not allowed to read comments on this trip',
		);

		const result = await this.repo.listComments(userId, data);

		return {
			comments: result.comments,
			pagination: result.pagination,
		};
	}

	async updateComment(
		userId: string,
		data: dto.UpdateCommentInput,
	): Promise<dto.UpdateCommentOutput> {
		const comment = await this.repo.getComment(data.commentId);

		invariant(
			authz.canUpdateComment(comment, userId),
			'FORBIDDEN',
			'User is not allowed to update this comment',
		);

		const result = await this.repo.updateComment(userId, data);

		return {
			comment: result,
		};
	}

	async deleteComment(
		userId: string,
		data: dto.DeleteCommentInput,
	): Promise<dto.DeleteCommentOutput> {
		const comment = await this.repo.getComment(data.commentId);
		const trip = await this.repo.get(userId, { id: comment.tripId });

		invariant(
			authz.canDeleteComment(trip, comment, userId),
			'FORBIDDEN',
			'User is not allowed to delete this comment',
		);

		await this.repo.deleteComment(userId, data);

		return {};
	}

	async update(
		userId: string,
		data: dto.UpdateInput,
	): Promise<dto.UpdateOutput> {
		invariant(
			data.startAt.getTime() < data.endAt.getTime(),
			'BAD_REQUEST',
			'Trip start date must be before end date',
		);

		invariant(
			data.startAt.getTime() > Date.now(),
			'BAD_REQUEST',
			'Trip start date must be in the future',
		);

		const trip = await this.repo.get(userId, { id: data.id });

		invariant(
			authz.canRead(trip, userId),
			'FORBIDDEN',
			'User is not allowed to access this trip',
		);

		invariant(
			authz.canUpdateTrip(trip, userId),
			'FORBIDDEN',
			'User is not allowed to update this trip',
		);

		const [newTrip, isDateChanged] = await this.repo.update(userId, data);

		if (isDateChanged && newTrip.visibilityLevel !== 'private') {
			await this.jobs.notification.queue.addBulk(
				newTrip.participants.map((p) => ({
					name: 'create-notification',
					data: {
						entityId: newTrip.id,
						entityType: 'trip',
						id: nanoid(),
						recipientId: p.userId,
						type: 'trip_update',
						data: {
							trip: {
								id: newTrip.id,
								title: newTrip.title,
							},
						},
					},
				})),
			);
		}

		return {
			trip: newTrip,
		};
	}

	async createLocation(
		userId: string,
		data: dto.CreateLocationInput,
	): Promise<dto.CreateLocationOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		invariant(
			authz.canRead(trip, userId),
			'FORBIDDEN',
			'User is not allowed to access this trip',
		);

		invariant(
			authz.canCreateLocation(trip, userId),
			'FORBIDDEN',
			'User is not allowed to create locations on this trip',
		);

		invariant(
			data.scheduledTime.getTime() >= trip.startAt.getTime(),
			'BAD_REQUEST',
			'Location scheduled time cannot be before trip start date',
		);

		invariant(
			data.scheduledTime.getTime() <= trip.endAt.getTime(),
			'BAD_REQUEST',
			'Location scheduled time cannot be after trip end date',
		);

		if (data.description === undefined) {
			data.description = trip.description;
		}

		const result = await this.repo.createLocation(userId, data);

		return {
			location: result,
		};
	}

	async updateLocation(
		userId: string,
		data: dto.UpdateLocationInput,
	): Promise<dto.UpdateLocationOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		invariant(
			authz.canRead(trip, userId),
			'FORBIDDEN',
			'User is not allowed to access this trip',
		);

		invariant(
			authz.canUpdateLocation(trip, userId),
			'FORBIDDEN',
			'User is not allowed to update locations on this trip',
		);

		const location = await this.repo.getLocation(userId, data.locationId);

		if (data.description === undefined) {
			data.description = location.description;
		}

		if (data.scheduledTime === undefined) {
			data.scheduledTime = location.scheduledTime;
		}

		invariant(
			data.scheduledTime.getTime() >= trip.startAt.getTime(),
			'BAD_REQUEST',
			'Location scheduled time cannot be before trip start date',
		);

		invariant(
			data.scheduledTime.getTime() <= trip.endAt.getTime(),
			'BAD_REQUEST',
			'Location scheduled time cannot be after trip end date',
		);

		const result = await this.repo.updateLocation(userId, data);

		return {
			location: result,
		};
	}

	async deleteLocation(
		userId: string,
		data: dto.DeleteLocationInput,
	): Promise<dto.DeleteLocationOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		invariant(
			authz.canRead(trip, userId),
			'FORBIDDEN',
			'User is not allowed to access this trip',
		);

		invariant(
			authz.canDeleteLocation(trip, userId),
			'FORBIDDEN',
			'User is not allowed to delete locations on this trip',
		);

		await this.repo.deleteLocation(userId, data);

		return {};
	}

	async updateRequestedAmenities(
		userId: string,
		data: dto.UpdateRequestedAmenitiesInput,
	): Promise<dto.UpdateRequestedAmenitiesOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		invariant(
			authz.canRead(trip, userId),
			'FORBIDDEN',
			'User is not allowed to access this trip',
		);

		invariant(
			authz.canUpdateTrip(trip, userId),
			'FORBIDDEN',
			'User is not allowed to update requested amenities on this trip',
		);

		const result = await this.repo.updateRequestedAmenities(userId, data);

		return {
			trip: result,
		};
	}

	async getSummary(
		userId: string,
		data: dto.GetSummaryInput,
	): Promise<dto.GetSummaryOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		invariant(
			authz.canRead(trip, userId),
			'FORBIDDEN',
			'User is not allowed to access this trip',
		);

		const totalCities = new Set(
			trip.locations.map((l) => l.place.address.cityId),
		).size;
		const totalDays = eachDayOfInterval({
			start: trip.startAt,
			end: trip.endAt,
		}).length;
		const totalParticipants = trip.participants.length + 1;
		const totalLocations = new Set(trip.locations.map((l) => l.place.id)).size;
		const totalComments = await this.repo.countComments(trip.id);
		const totalItineraryItems = 0;
		const totalAssets = 0;

		return {
			trip: trip,
			totalCities,
			totalDays,
			totalParticipants,
			totalLocations,
			totalComments,
			totalItineraryItems,
			totalAssets,
		};
	}
}
