package trips

import "wanderlust/pkg/dto"

// Check if the action user is the trip owner or an editor.
func (s *Service) isPrivilegedUser(trip *dto.Trip, userId string) bool {
	if trip.OwnerID == userId {
		return true
	}

	for _, p := range trip.Participants {
		if p.ID == userId && p.Role == "editor" {
			return true
		}
	}

	return false
}

func (s *Service) canCreateInvite(trip *dto.Trip, userId string) bool {
	return s.isPrivilegedUser(trip, userId)
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

func (s *Service) canReadComment(trip *dto.Trip, userId string) bool {
	// Comment read privileges are the same as trip read privileges
	return s.canRead(trip, userId)
}

func (s *Service) canUpdateComment(comment *dto.TripComment, userId string) bool {
	// Only the owner can update the comment
	return comment.From.ID == userId
}

func (s *Service) canDeleteComment(trip *dto.Trip, comment *dto.TripComment, userId string) bool {
	// Trip owner can delete any comment
	if trip.OwnerID == userId {
		return true
	}

	// Trip editor can delete any comment
	// Trip participant can delete their own comment
	for _, p := range trip.Participants {
		if p.ID == userId && p.Role == "editor" {
			return true
		}

		if p.ID == comment.From.ID {
			return true
		}
	}

	// Otherwise, this user cannot delete the comment
	return false
}

func (s *Service) canManageAmenities(trip *dto.Trip, userId string) bool {
	return s.isPrivilegedUser(trip, userId)
}

func (s *Service) canUpdateTrip(trip *dto.Trip, userId string) bool {
	// Currently, only the owner can update the trip
	return trip.OwnerID == userId
}

func (s *Service) canCreateLocation(trip *dto.Trip, userId string) bool {
	return s.isPrivilegedUser(trip, userId)
}

func (s *Service) canUpdateTripLocation(trip *dto.Trip, userId string) bool {
	return s.isPrivilegedUser(trip, userId)
}

func (s *Service) canDeleteTripLocation(trip *dto.Trip, userId string) bool {
	return s.isPrivilegedUser(trip, userId)
}
