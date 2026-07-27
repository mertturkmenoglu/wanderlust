import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { os } from './internal/router';
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
import { CreateItineraryItemMethod } from './methods/itinerary/create';
import { DeleteItineraryItemMethod } from './methods/itinerary/delete';
import { UpdateItineraryItemMethod } from './methods/itinerary/update';
import { LeaveTripMethod } from './methods/leave';
import { ListTripsMethod } from './methods/list';
import { DeleteParticipantMethod } from './methods/participants/delete';
import { GetTripSummaryMethod } from './methods/summary';
import { UpdateTripMethod } from './methods/update';
import { CommentProvider } from './provides/comment';
import { InviteProvider } from './provides/invite';
import { ItineraryProvider } from './provides/itinerary';
import { TripProvider } from './provides/trip';

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
		CreateItineraryItemMethod,
		UpdateItineraryItemMethod,
		DeleteItineraryItemMethod,
		CommentProvider,
		InviteProvider,
		ItineraryProvider,
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
		const createItineraryItem = container.get(CreateItineraryItemMethod);
		const updateItineraryItem = container.get(UpdateItineraryItemMethod);
		const deleteItineraryItem = container.get(DeleteItineraryItemMethod);

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

			itinerary: {
				create: createItineraryItem.route(),
				update: updateItineraryItem.route(),
				delete: deleteItineraryItem.route(),
			},
		});
	},
});
