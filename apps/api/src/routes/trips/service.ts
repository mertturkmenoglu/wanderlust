import { ORPCError } from '@orpc/client';
import { eachDayOfInterval } from 'date-fns';
import { inject, injectable } from 'inversify';
import * as authz from './authz';
import type * as dto from './dto';
import { TripsRepository } from './repository';

@injectable()
export class TripsService {
	constructor(
		@inject(TripsRepository) private readonly repo: TripsRepository,
	) {}

	async get(userId: string, data: dto.GetInput): Promise<dto.GetOutput> {
		const result = await this.repo.get(userId, data);

		if (!authz.canRead(result, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to access trip with id ${data.id}`,
			});
		}

		return {
			trip: result,
		};
	}

	async listInvites(
		userId: string,
		data: dto.ListInvitesInput,
	): Promise<dto.ListInvitesOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		if (!authz.canRead(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to access trip with id ${data.id}`,
			});
		}

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

		if (!authz.canRead(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to access trip with id ${data.id}`,
			});
		}

		if (!authz.canCreateInvite(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to invite participants to trip with id ${data.id}`,
			});
		}

		if (trip.visibilityLevel === 'private') {
			throw new ORPCError('CONFLICT', {
				message: 'Cannot invite participants to private trips',
			});
		}

		const result = await this.repo.createInvite(userId, data, trip.title);

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
		if (data.startAt.getTime() >= data.endAt.getTime()) {
			throw new ORPCError('BAD_REQUEST', {
				message: 'Trip start date must be before end date',
			});
		}

		if (data.startAt.getTime() === Date.now()) {
			throw new ORPCError('BAD_REQUEST', {
				message: 'Trip start date must be in the future',
			});
		}

		const result = await this.repo.create(userId, data);

		return {
			trip: result,
		};
	}

	async getInviteDetails(
		userId: string,
		data: dto.GetInviteDetailsInput,
	): Promise<dto.GetInviteDetailsOutput> {
		const invite = await this.repo.getInviteDetails(userId, data);

		if (invite.toId !== userId) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to access invite with id ${data.inviteId}`,
			});
		}

		if (invite.expiresAt.getTime() < Date.now()) {
			await this.repo.deleteInvite(userId, {
				id: data.id,
				inviteId: data.inviteId,
			});

			throw new ORPCError('GONE', {
				message: `Invite with id ${data.inviteId} has expired`,
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

		const result = await this.repo.acceptOrDeclineInvite(
			userId,
			data,
			invite.role,
		);

		return {
			accepted: result,
		};
	}

	async leave(userId: string, data: dto.LeaveInput): Promise<dto.LeaveOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		if (!authz.canRead(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to access trip with id ${data.id}`,
			});
		}

		if (authz.isOwner(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `Owner of the trip with id ${data.id} cannot leave the trip`,
			});
		}

		await this.repo.leave(userId, data);

		return {};
	}

	async deleteInvite(
		userId: string,
		data: dto.DeleteInviteInput,
	): Promise<dto.DeleteInviteOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		if (!authz.canRead(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to access trip with id ${data.id}`,
			});
		}

		if (!authz.canDeleteInvite(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to delete invites for trip with id ${data.id}`,
			});
		}

		await this.repo.deleteInvite(userId, data);

		return {};
	}

	async _delete(
		userId: string,
		data: dto.DeleteInput,
	): Promise<dto.DeleteOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		if (!authz.canRead(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to access trip with id ${data.id}`,
			});
		}

		if (!authz.isOwner(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `Only the owner can delete the trip with id ${data.id}`,
			});
		}

		await this.repo._delete(userId, data);

		return {};
	}

	async deleteParticipant(
		userId: string,
		data: dto.DeleteParticipantInput,
	): Promise<dto.DeleteParticipantOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		if (!authz.canRead(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to access trip with id ${data.id}`,
			});
		}

		if (!authz.canDeleteParticipant(trip, userId, data.userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to remove participant with id ${data.userId} from trip with id ${data.id}`,
			});
		}

		await this.repo.deleteParticipant(userId, data);

		return {};
	}

	async createComment(
		userId: string,
		data: dto.CreateCommentInput,
	): Promise<dto.CreateCommentOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		if (!authz.canRead(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to access trip with id ${data.id}`,
			});
		}

		if (!authz.canCreateComment(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to create comments on trip with id ${data.id}`,
			});
		}

		const result = await this.repo.createComment(userId, data);

		return {
			comment: result,
		};
	}

	async listComments(
		userId: string,
		data: dto.ListCommentsInput,
	): Promise<dto.ListCommentsOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		if (!authz.canRead(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to access trip with id ${data.id}`,
			});
		}

		if (!authz.canReadComment(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to read comments on trip with id ${data.id}`,
			});
		}

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

		if (!authz.canUpdateComment(comment, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to update comment with id ${data.commentId}`,
			});
		}

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

		if (!authz.canDeleteComment(trip, comment, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to delete comment with id ${data.commentId}`,
			});
		}

		await this.repo.deleteComment(userId, data);

		return {};
	}

	async update(
		userId: string,
		data: dto.UpdateInput,
	): Promise<dto.UpdateOutput> {
		if (data.startAt.getTime() >= data.endAt.getTime()) {
			throw new ORPCError('BAD_REQUEST', {
				message: 'Trip start date must be before end date',
			});
		}

		if (data.startAt.getTime() === Date.now()) {
			throw new ORPCError('BAD_REQUEST', {
				message: 'Trip start date must be in the future',
			});
		}

		const trip = await this.repo.get(userId, { id: data.id });

		if (!authz.canRead(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to access trip with id ${data.id}`,
			});
		}

		if (!authz.canUpdateTrip(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to update trip with id ${data.id}`,
			});
		}

		const result = await this.repo.update(userId, data);

		return {
			trip: result,
		};
	}

	async createLocation(
		userId: string,
		data: dto.CreateLocationInput,
	): Promise<dto.CreateLocationOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		if (!authz.canRead(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to access trip with id ${data.id}`,
			});
		}

		if (!authz.canCreateLocation(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to create locations on trip with id ${data.id}`,
			});
		}

		if (data.scheduledTime.getTime() < trip.startAt.getTime()) {
			throw new ORPCError('BAD_REQUEST', {
				message: 'Location scheduled time cannot be before trip start date',
			});
		}

		if (data.scheduledTime.getTime() > trip.endAt.getTime()) {
			throw new ORPCError('BAD_REQUEST', {
				message: 'Location scheduled time cannot be after trip end date',
			});
		}

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

		if (!authz.canRead(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to access trip with id ${data.id}`,
			});
		}

		if (!authz.canUpdateLocation(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to update locations on trip with id ${data.id}`,
			});
		}

		const location = await this.repo.getLocation(data.locationId);

		if (data.description === undefined) {
			data.description = location.description;
		}

		if (data.scheduledTime === undefined) {
			data.scheduledTime = location.scheduledTime;
		}

		if (data.scheduledTime.getTime() < trip.startAt.getTime()) {
			throw new ORPCError('BAD_REQUEST', {
				message: 'Location scheduled time cannot be before trip start date',
			});
		}

		if (data.scheduledTime.getTime() > trip.endAt.getTime()) {
			throw new ORPCError('BAD_REQUEST', {
				message: 'Location scheduled time cannot be after trip end date',
			});
		}

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

		if (!authz.canRead(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to access trip with id ${data.id}`,
			});
		}

		if (!authz.canDeleteLocation(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to delete locations on trip with id ${data.id}`,
			});
		}

		await this.repo.deleteLocation(userId, data);

		return {};
	}

	async updateRequestedAmenities(
		userId: string,
		data: dto.UpdateRequestedAmenitiesInput,
	): Promise<dto.UpdateRequestedAmenitiesOutput> {
		const trip = await this.repo.get(userId, { id: data.id });

		if (!authz.canRead(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to access trip with id ${data.id}`,
			});
		}

		if (!authz.canUpdateTrip(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to update requested amenities on trip with id ${data.id}`,
			});
		}

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

		if (!authz.canRead(trip, userId)) {
			throw new ORPCError('FORBIDDEN', {
				message: `User with id ${userId} is not allowed to access trip with id ${data.id}`,
			});
		}

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
