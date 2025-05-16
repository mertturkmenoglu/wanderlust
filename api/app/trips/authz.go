package trips

import "wanderlust/pkg/dto"

func (s *Service) canCreateInvite(trip *dto.Trip, userId string) bool {
	// Owner can invite anyone
	if trip.OwnerID == userId {
		return true
	}

	// If the action user is an editor, they can invite.
	for _, p := range trip.Participants {
		if p.ID == userId && p.Role == "editor" {
			return true
		}
	}

	return false
}

func (s *Service) canRemoveParticipant(trip *dto.Trip, userId string, participantId string) bool {
	// You cannot remove the owner
	if participantId == trip.OwnerID {
		return false
	}

	// You can remove yourself regardless of the role
	if userId == participantId {
		return true
	}

	// Owner can remove anyone except themselves
	if trip.OwnerID == userId {
		return true
	}

	// If the action user is an editor, they can remove anyone except the owner and themselves
	for _, p := range trip.Participants {
		if p.ID == userId && p.Role == "editor" {
			return true
		}
	}

	// By default, you cannot remove anyone
	return false
}

func (s *Service) canRead(trip *dto.Trip, userId string) bool {
	switch trip.VisibilityLevel {
	case dto.TRIP_VISIBILITY_LEVEL_PUBLIC:
		return true
	case dto.TRIP_VISIBILITY_LEVEL_FRIENDS:
		if trip.OwnerID == userId {
			return true
		}

		for _, friend := range trip.Participants {
			if friend.ID == userId {
				return true
			}
		}
		return false
	case dto.TRIP_VISIBILITY_LEVEL_PRIVATE:
		return trip.OwnerID == userId
	default:
		return false
	}
}

func (s *Service) canCreateComment(trip *dto.Trip, userId string) bool {
	if trip.OwnerID == userId {
		return true
	}

	for _, p := range trip.Participants {
		if p.ID == userId {
			return true
		}
	}

	return false
}
