import type { Types } from '@wanderlust/common';

type Trip = Types.Trips.ExtendedWithParticipantsAndLocations;

// Check if the action user is the trip owner or an editor.
export function isPrivilegedUser(trip: Trip, userId: string): boolean {
	if (trip.ownerId === userId) {
		return true;
	}

	for (const participant of trip.participants) {
		if (participant.userId === userId && participant.role === 'editor') {
			return true;
		}
	}

	return false;
}

export function isOwner(trip: Trip, userId: string): boolean {
	return trip.ownerId === userId;
}

export function isParticipant(trip: Trip, userId: string): boolean {
	for (const participant of trip.participants) {
		if (participant.userId === userId) {
			return true;
		}
	}

	return false;
}

export function isOwnerOrParticipant(trip: Trip, userId: string): boolean {
	return isOwner(trip, userId) || isParticipant(trip, userId);
}

export function canDeleteTrip(trip: Trip, userId: string): boolean {
	// Only the owner can delete the trip
	return isOwner(trip, userId);
}

export function canCreateInvite(trip: Trip, userId: string): boolean {
	// Only privileged users can create invites.
	return isPrivilegedUser(trip, userId);
}

export function canDeleteInvite(trip: Trip, userId: string): boolean {
	// Only privileged users can delete invites.
	return isPrivilegedUser(trip, userId);
}

export function canDeleteParticipant(
	trip: Trip,
	actorId: string,
	targetId: string,
): boolean {
	// Owner cannot be deleted
	if (targetId === trip.ownerId) {
		return false;
	}

	// Is target a participant in the trip?
	const participant = trip.participants.find((p) => p.userId === targetId);

	if (!participant) {
		// If the target user is not a participant, you cannot delete them.
		return false;
	}

	// Are you the owner or a participant?
	const ownerOrParticipant = isOwnerOrParticipant(trip, actorId);

	if (!ownerOrParticipant) {
		// If the action user is not the owner or a participant, they cannot delete anyone.
		return false;
	}

	// At this point, we asserted:
	// 1. Actor is part of this trip.
	// 2. Target is part of this trip.
	// 3. Target is not the owner.

	// Are you trying to remove yourself?
	if (actorId === targetId) {
		// Because we asserted you are not trying to remove the owner, you can remove yourself.
		return true;
	}

	// Are you the owner?
	if (trip.ownerId === actorId) {
		// Owner can remove anyone.
		return true;
	}

	const isEditor = trip.participants.find(
		(p) => p.userId === actorId && p.role === 'editor',
	);

	if (isEditor) {
		// If the action user is an editor, they can remove anyone except the owner.
		return true;
	}

	// By default, you cannot remove anyone
	return false;
}

export function canRead(trip: Trip, userId: string): boolean {
	switch (trip.visibilityLevel) {
		case 'public':
			return true;
		case 'friends': {
			return isOwnerOrParticipant(trip, userId);
		}
		case 'private': {
			return isOwner(trip, userId);
		}
		default:
			return false;
	}
}

export function canCreateComment(trip: Trip, userId: string): boolean {
	return isOwnerOrParticipant(trip, userId);
}

export function canReadComment(trip: Trip, userId: string): boolean {
	// Comment read privileges are the same as trip read privileges
	return canRead(trip, userId);
}

export function canUpdateComment(
	comment: Types.Trips.Comment,
	userId: string,
): boolean {
	// Only the comment author can update the comment
	return comment.userId === userId;
}

export function canDeleteComment(
	trip: Trip,
	comment: Types.Trips.Comment,
	userId: string,
): boolean {
	// Trip owner and editors can delete any comment
	if (isPrivilegedUser(trip, userId)) {
		return true;
	}

	// If the comment owner is the action user, they can delete their own comment
	return comment.userId === userId;
}

export function canManageAmenities(trip: Trip, userId: string): boolean {
	// Only privileged users can manage amenities
	return isPrivilegedUser(trip, userId);
}

export function canUpdateTrip(trip: Trip, userId: string): boolean {
	// Currently, only the owner can update the trip
	return isOwner(trip, userId);
}

export function canCreateLocation(trip: Trip, userId: string): boolean {
	// Only privileged users can create locations
	return isPrivilegedUser(trip, userId);
}

export function canUpdateLocation(trip: Trip, userId: string): boolean {
	// Only privileged users can update locations
	return isPrivilegedUser(trip, userId);
}

export function canDeleteLocation(trip: Trip, userId: string): boolean {
	// Only privileged users can delete locations
	return isPrivilegedUser(trip, userId);
}
