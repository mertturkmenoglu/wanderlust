package trips

import (
	"testing"
	"wanderlust/pkg/dto"

	"github.com/stretchr/testify/assert"
)

func TestOwnerShouldBePrivilegedUser(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
	}

	userId := "id-123"

	expected := true
	actual := isPrivilegedUser(trip, userId)

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldBePrivilegedUser(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "editor",
			},
		},
	}

	userId := "id-456"

	expected := true
	actual := isPrivilegedUser(trip, userId)

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOtherParticipantShouldNotBePrivilegedUser(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "participant",
			},
		},
	}

	userId := "id-456"
	expected := false
	actual := isPrivilegedUser(trip, userId)

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldNotBePrivilegedUser(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "participant",
			},
		},
	}

	userId := "id-789"
	expected := false
	actual := isPrivilegedUser(trip, userId)

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOwnerShouldBeAbleToCreateInvite(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
	}

	userId := "id-123"

	expected := true
	actual := canCreateInvite(trip, userId)

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldBeAbleToCreateInvite(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "editor",
			},
		},
	}

	userId := "id-456"

	expected := true
	actual := canCreateInvite(trip, userId)

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOtherParticipantShouldNotBeAbleToCreateInvite(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "participant",
			},
		},
	}

	userId := "id-456"

	expected := false
	actual := canCreateInvite(trip, userId)

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldNotBeAbleToCreateInvite(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "participant",
			},
		},
	}

	userId := "id-789"

	expected := false
	actual := canCreateInvite(trip, userId)

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOwnerShouldNotBeAbleToRemoveOwner(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
	}

	userId := "id-123"
	participantId := "id-123"

	expected := false
	actual := canRemoveParticipant(trip, userId, participantId)
	assert.Equal(t, expected, actual, "owner cannot be removed")
}

func TestOwnerShouldBeAbleToRemoveEditor(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "editor",
			},
		},
	}

	userId := "id-123"
	participantId := "id-456"

	expected := true
	actual := canRemoveParticipant(trip, userId, participantId)
	assert.Equal(t, expected, actual, "editor can be removed")
}

func TestOwnerShouldBeAbleToRemoveParticipant(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "participant",
			},
		},
	}

	userId := "id-123"
	participantId := "id-456"

	expected := true
	actual := canRemoveParticipant(trip, userId, participantId)
	assert.Equal(t, expected, actual, "participant can be removed")
}

func TestEditorShouldNotBeAbleToRemoveOwner(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "editor",
			},
		},
	}

	userId := "id-456"
	participantId := "id-123"

	expected := false
	actual := canRemoveParticipant(trip, userId, participantId)
	assert.Equal(t, expected, actual, "owner cannot be removed")
}

func TestEditorShouldBeAbleToRemoveThemselves(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "editor",
			},
		},
	}

	userId := "id-456"
	participantId := "id-456"

	expected := true
	actual := canRemoveParticipant(trip, userId, participantId)
	assert.Equal(t, expected, actual, "editor can remove themselves")
}

func TestEditorShouldBeAbleToRemoveAnotherEditor(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "editor",
			},
			{
				ID:   "id-789",
				Role: "editor",
			},
		},
	}

	userId := "id-789"
	participantId := "id-456"

	expected := true
	actual := canRemoveParticipant(trip, userId, participantId)
	assert.Equal(t, expected, actual, "editor can be removed")
}

func TestEditorShouldBeAbleToRemoveParticipant(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "editor",
			},
			{
				ID:   "id-789",
				Role: "participant",
			},
		},
	}

	userId := "id-456"
	participantId := "id-789"

	expected := true
	actual := canRemoveParticipant(trip, userId, participantId)
	assert.Equal(t, expected, actual, "participant can be removed")
}

func TestParticipantShouldNotBeAbleToRemoveOwner(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "participant",
			},
		},
	}

	userId := "id-456"
	participantId := "id-123"

	expected := false
	actual := canRemoveParticipant(trip, userId, participantId)
	assert.Equal(t, expected, actual, "owner cannot be removed")
}

func TestParticipantShouldNotBeAbleToRemoveEditor(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "participant",
			},
			{
				ID:   "id-789",
				Role: "editor",
			},
		},
	}

	userId := "id-456"
	participantId := "id-789"

	expected := false
	actual := canRemoveParticipant(trip, userId, participantId)
	assert.Equal(t, expected, actual, "participant cannot remove editor")
}

func TestParticipantShouldBeAbleToRemoveThemselves(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "participant",
			},
		},
	}

	userId := "id-456"
	participantId := "id-456"

	expected := true
	actual := canRemoveParticipant(trip, userId, participantId)
	assert.Equal(t, expected, actual, "participant can remove themselves")
}

func TestParticipantShouldNotBeAbleToRemoveAnotherParticipant(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "participant",
			},
			{
				ID:   "id-789",
				Role: "participant",
			},
		},
	}

	userId := "id-789"
	participantId := "id-456"

	expected := false
	actual := canRemoveParticipant(trip, userId, participantId)
	assert.Equal(t, expected, actual, "participant cannot remove another participant")
}

func TestNonParticipantShouldNotBeAbleToRemoveOwner(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
	}

	userId := "id-789"
	participantId := "id-123"

	expected := false
	actual := canRemoveParticipant(trip, userId, participantId)
	assert.Equal(t, expected, actual, "non-participant cannot remove owner")
}

func TestNonParticipantShouldNotBeAbleToRemoveEditor(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "editor",
			},
		},
	}

	userId := "id-789"
	participantId := "id-456"

	expected := false
	actual := canRemoveParticipant(trip, userId, participantId)
	assert.Equal(t, expected, actual, "non-participant cannot remove editor")
}

func TestNonParticipantShouldNotBeAbleToRemoveParticipant(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "participant",
			},
		},
	}

	userId := "id-789"
	participantId := "id-456"

	expected := false
	actual := canRemoveParticipant(trip, userId, participantId)
	assert.Equal(t, expected, actual, "non-participant cannot remove participant")
}

func TestOwnerShoulBeAbleToReadPrivateTrip(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_PRIVATE,
	}

	userId := "id-123"

	expected := true
	actual := canRead(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldNotBeAbleToReadPrivateTrip(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_PRIVATE,
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "editor",
			},
		},
	}

	userId := "id-456"

	expected := false
	actual := canRead(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestParticipantShouldNotBeAbleToReadPrivateTrip(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_PRIVATE,
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "participant",
			},
		},
	}

	userId := "id-456"

	expected := false
	actual := canRead(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldNotBeAbleToReadPrivateTrip(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_PRIVATE,
	}

	userId := "id-789"

	expected := false
	actual := canRead(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOwnerShouldBeAbleToReadFriendsLevelTrip(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_FRIENDS,
	}

	userId := "id-123"

	expected := true
	actual := canRead(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldBeAbleToReadFriendsLevelTrip(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_FRIENDS,
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "editor",
			},
		},
	}

	userId := "id-456"

	expected := true
	actual := canRead(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestParticipantShouldBeAbleToReadFriendsLevelTrip(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_FRIENDS,
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "participant",
			},
		},
	}

	userId := "id-456"

	expected := true
	actual := canRead(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldNotBeAbleToReadFriendsLevelTrip(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_FRIENDS,
	}

	userId := "id-789"

	expected := false
	actual := canRead(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOwnerShouldBeAbleToReadPublicTrip(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_PUBLIC,
	}

	userId := "id-123"

	expected := true
	actual := canRead(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldBeAbleToReadPublicTrip(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_PUBLIC,
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "editor",
			},
		},
	}

	userId := "id-456"

	expected := true
	actual := canRead(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestParticipantShouldBeAbleToReadPublicTrip(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_PUBLIC,
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "participant",
			},
		},
	}

	userId := "id-456"

	expected := true
	actual := canRead(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldBeAbleToReadPublicTrip(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_PUBLIC,
	}

	userId := "id-789"

	expected := true
	actual := canRead(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOwnerShouldBeAbleToCreateComment(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
	}

	userId := "id-123"

	expected := true
	actual := canCreateComment(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldBeAbleToCreateComment(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "editor",
			},
		},
	}

	userId := "id-456"

	expected := true
	actual := canCreateComment(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestParticipantShouldBeAbleToCreateComment(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
		Participants: []dto.TripUser{
			{
				ID:   "id-456",
				Role: "participant",
			},
		},
	}

	userId := "id-456"

	expected := true
	actual := canCreateComment(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldNotBeAbleToCreateComment(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
	}

	userId := "id-789"

	expected := false
	actual := canCreateComment(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}
