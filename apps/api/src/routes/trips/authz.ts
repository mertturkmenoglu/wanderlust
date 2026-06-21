import type { trips as dto } from '@wanderlust/contract';

// Check if the action user is the trip owner or an editor.
export function isPrivilegedUser(
	trip: dto.ExtendedTrip,
	userId: string,
): boolean {
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

export function isOwner(trip: dto.ExtendedTrip, userId: string): boolean {
	return trip.ownerId === userId;
}

export function isParticipant(trip: dto.ExtendedTrip, userId: string): boolean {
	for (const participant of trip.participants) {
		if (participant.userId === userId) {
			return true;
		}
	}

	return false;
}

export function isOwnerOrParticipant(
	trip: dto.ExtendedTrip,
	userId: string,
): boolean {
	return isOwner(trip, userId) || isParticipant(trip, userId);
}

export function canCreateInvite(
	trip: dto.ExtendedTrip,
	userId: string,
): boolean {
	// Only privileged users can create invites.
	return isPrivilegedUser(trip, userId);
}

export function canDeleteInvite(
	trip: dto.ExtendedTrip,
	userId: string,
): boolean {
	// Only privileged users can delete invites.
	return isPrivilegedUser(trip, userId);
}

export function canDeleteParticipant(
	trip: dto.ExtendedTrip,
	userId: string,
	participantId: string,
): boolean {
	// Owner cannot be deleted
	if (trip.ownerId === participantId) {
		return false;
	}

	// You can remove yourself regardless of your role
	if (userId === participantId) {
		return true;
	}

	// Owner can remove anyone except themselves
	if (trip.ownerId === userId) {
		return true;
	}

	// If the action user is an editor, they can remove anyone except the owner.
	for (const participant of trip.participants) {
		if (participant.userId === userId && participant.role === 'editor') {
			return true;
		}
	}

	// By default, you cannot remove anyone
	return false;
}

export function canRead(trip: dto.ExtendedTrip, userId: string): boolean {
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

export function canCreateComment(
	trip: dto.ExtendedTrip,
	userId: string,
): boolean {
	return isOwnerOrParticipant(trip, userId);
}

export function canReadComment(
	trip: dto.ExtendedTrip,
	userId: string,
): boolean {
	// Comment read privileges are the same as trip read privileges
	return canRead(trip, userId);
}

export function canUpdateComment(
	comment: dto.Comment,
	userId: string,
): boolean {
	// Only the comment author can update the comment
	return comment.userId === userId;
}

export function canDeleteComment(
	trip: dto.ExtendedTrip,
	comment: dto.Comment,
	userId: string,
): boolean {
	// Trip owner and editors can delete any comment
	if (isPrivilegedUser(trip, userId)) {
		return true;
	}

	// If the comment owner is the action user, they can delete their own comment
	return comment.userId === userId;
}

export function canManageAmenities(
	trip: dto.ExtendedTrip,
	userId: string,
): boolean {
	// Only privileged users can manage amenities
	return isPrivilegedUser(trip, userId);
}

export function canUpdateTrip(trip: dto.ExtendedTrip, userId: string): boolean {
	// Currently, only the owner can update the trip
	return isOwner(trip, userId);
}

export function canCreateLocation(
	trip: dto.ExtendedTrip,
	userId: string,
): boolean {
	// Only privileged users can create locations
	return isPrivilegedUser(trip, userId);
}

export function canUpdateLocation(
	trip: dto.ExtendedTrip,
	userId: string,
): boolean {
	// Only privileged users can update locations
	return isPrivilegedUser(trip, userId);
}

export function canDeleteLocation(
	trip: dto.ExtendedTrip,
	userId: string,
): boolean {
	// Only privileged users can delete locations
	return isPrivilegedUser(trip, userId);
}
