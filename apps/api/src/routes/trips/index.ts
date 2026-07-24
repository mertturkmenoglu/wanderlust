import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { CreateCommentMethod } from './methods/comments/create';
import { DeleteCommentMethod } from './methods/comments/delete';
import { ListCommentsMethod } from './methods/comments/list';
import { UpdateCommentMethod } from './methods/comments/update';
import { CreateTripMethod } from './methods/create';
import { DeleteTripMethod } from './methods/delete';
import { GetTripMethod } from './methods/get';
import { CreateInviteMethod } from './methods/invites/create';
import { DeleteInviteMethod } from './methods/invites/delete';
import { GetInviteDetailsMethod } from './methods/invites/details';
import { ListInvitesMethod } from './methods/invites/list';
import { ListMyInvitationsMethod } from './methods/invites/list-mine';
import { RespondMethod } from './methods/invites/respond';
import { LeaveTripMethod } from './methods/leave';
import { ListTripsMethod } from './methods/list';
import { CreateLocationMethod } from './methods/locations/create';
import { DeleteLocationMethod } from './methods/locations/delete';
import { UpdateLocationMethod } from './methods/locations/update';
import { DeleteParticipantMethod } from './methods/participants/delete';
import { GetTripSummaryMethod } from './methods/summary';
import { UpdateTripMethod } from './methods/update';
import { CommentProvider } from './provides/comment';
import { InviteProvider } from './provides/invite';
import { LocationProvider } from './provides/location';
import { TripProvider } from './provides/trip';
import { os } from './shared/router';

export const module = defineModule({
	exports: [
		ListTripsMethod,
		GetTripMethod,
		CreateTripMethod,
		LeaveTripMethod,
		DeleteTripMethod,
		UpdateTripMethod,
		GetTripSummaryMethod,
		DeleteParticipantMethod,
		CreateCommentMethod,
		ListCommentsMethod,
		UpdateCommentMethod,
		DeleteCommentMethod,
		ListInvitesMethod,
		CreateInviteMethod,
		ListMyInvitationsMethod,
		GetInviteDetailsMethod,
		DeleteInviteMethod,
		RespondMethod,
		CreateLocationMethod,
		UpdateLocationMethod,
		DeleteLocationMethod,
		CommentProvider,
		InviteProvider,
		LocationProvider,
		TripProvider,
	],
	router: () => {
		const list = container.get(ListTripsMethod);
		const get = container.get(GetTripMethod);
		const create = container.get(CreateTripMethod);
		const leave = container.get(LeaveTripMethod);
		const del = container.get(DeleteTripMethod);
		const update = container.get(UpdateTripMethod);
		const getSummary = container.get(GetTripSummaryMethod);
		const deleteParticipant = container.get(DeleteParticipantMethod);
		const createComment = container.get(CreateCommentMethod);
		const listComments = container.get(ListCommentsMethod);
		const updateComment = container.get(UpdateCommentMethod);
		const deleteComment = container.get(DeleteCommentMethod);
		const listInvites = container.get(ListInvitesMethod);
		const createInvite = container.get(CreateInviteMethod);
		const listMyInvites = container.get(ListMyInvitationsMethod);
		const getInviteDetails = container.get(GetInviteDetailsMethod);
		const deleteInvite = container.get(DeleteInviteMethod);
		const respond = container.get(RespondMethod);
		const createLocation = container.get(CreateLocationMethod);
		const updateLocation = container.get(UpdateLocationMethod);
		const deleteLocation = container.get(DeleteLocationMethod);

		return os.router({
			list: list.route(),
			get: get.route(),
			create: create.route(),
			leave: leave.route(),
			delete: del.route(),
			update: update.route(),
			getSummary: getSummary.route(),

			invites: {
				list: listInvites.route(),
				create: createInvite.route(),
				listMine: listMyInvites.route(),
				getDetails: getInviteDetails.route(),
				delete: deleteInvite.route(),
				respond: respond.route(),
			},

			participants: {
				delete: deleteParticipant.route(),
			},

			comments: {
				create: createComment.route(),
				list: listComments.route(),
				update: updateComment.route(),
				delete: deleteComment.route(),
			},

			locations: {
				create: createLocation.route(),
				update: updateLocation.route(),
				delete: deleteLocation.route(),
			},
		});
	},
});
