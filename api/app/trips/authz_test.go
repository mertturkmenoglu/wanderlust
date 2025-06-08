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

func TestOwnerShouldBeAbleToReadPrivateTripComment(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_PRIVATE,
	}

	userId := "id-123"

	expected := true
	actual := canReadComment(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOwnerShouldBeAbleToReadFriendsLevelTripComment(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_FRIENDS,
	}

	userId := "id-123"

	expected := true
	actual := canReadComment(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOwnerShouldBeAbleToReadPublicTripComment(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_PUBLIC,
	}

	userId := "id-123"

	expected := true
	actual := canReadComment(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldNotBeAbleToReadPrivateTripComment(t *testing.T) {
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
	actual := canReadComment(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldBeAbleToReadFriendsLevelTripComment(t *testing.T) {
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
	actual := canReadComment(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldBeAbleToReadPublicTripComment(t *testing.T) {
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
	actual := canReadComment(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestParticipantShouldNotBeAbleToReadPrivateTripComment(t *testing.T) {
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
	actual := canReadComment(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestParticipantShouldBeAbleToReadFriendsLevelTripComment(t *testing.T) {
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
	actual := canReadComment(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestParticipantShouldBeAbleToReadPublicTripComment(t *testing.T) {
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
	actual := canReadComment(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldNotBeAbleToReadPrivateTripComment(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_PRIVATE,
	}

	userId := "id-789"

	expected := false
	actual := canReadComment(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldNotBeAbleToReadFriendsLevelTripComment(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_FRIENDS,
	}

	userId := "id-789"

	expected := false
	actual := canReadComment(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldBeAbleToReadPublicTripComment(t *testing.T) {
	trip := &dto.Trip{
		OwnerID:         "id-123",
		VisibilityLevel: dto.TRIP_VISIBILITY_LEVEL_PUBLIC,
	}

	userId := "id-789"

	expected := true
	actual := canReadComment(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOwnerShouldNotBeAbleToUpdateOtherUserComment(t *testing.T) {
	tripOwnerId := "id-123"
	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: "id-789"},
		Content: "Test comment",
	}

	expected := false
	actual := canUpdateComment(comment, tripOwnerId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldNotBeAbleToUpdateOtherUserComment(t *testing.T) {
	editorId := "id-123"
	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: "id-789"},
		Content: "Test comment",
	}

	expected := false
	actual := canUpdateComment(comment, editorId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestParticipantShouldNotBeAbleToUpdateOtherUserComment(t *testing.T) {
	participantId := "id-123"
	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: "id-789"},
		Content: "Test comment",
	}

	expected := false
	actual := canUpdateComment(comment, participantId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldNotBeAbleToUpdateOtherUserComment(t *testing.T) {
	nonParticipantId := "id-123"
	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: "id-789"},
		Content: "Test comment",
	}

	expected := false
	actual := canUpdateComment(comment, nonParticipantId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestCommentOwnerShouldBeAbleToUpdateComment(t *testing.T) {
	commentOwnerId := "id-123"
	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: commentOwnerId},
		Content: "Test comment",
	}

	expected := true
	actual := canUpdateComment(comment, commentOwnerId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOwnerShouldBeAbleToDeleteOwnComment(t *testing.T) {
	tripOwnerId := "id-123"
	trip := &dto.Trip{
		OwnerID: tripOwnerId,
	}

	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: tripOwnerId},
		Content: "Test comment",
	}

	expected := true
	actual := canDeleteComment(trip, comment, tripOwnerId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOwnerShouldBeAbleToDeleteEditorComment(t *testing.T) {
	tripOwnerId := "id-123"
	editorId := "id-456"
	trip := &dto.Trip{
		OwnerID: tripOwnerId,
		Participants: []dto.TripUser{
			{
				ID:   editorId,
				Role: "editor",
			},
		},
	}

	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: editorId},
		Content: "Test comment",
	}

	expected := true
	actual := canDeleteComment(trip, comment, editorId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOwnerShouldBeAbleToDeleteParticipantComment(t *testing.T) {
	tripOwnerId := "id-123"
	participantId := "id-456"
	trip := &dto.Trip{
		OwnerID: tripOwnerId,
		Participants: []dto.TripUser{
			{
				ID:   participantId,
				Role: "participant",
			},
		},
	}

	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: participantId},
		Content: "Test comment",
	}

	expected := true
	actual := canDeleteComment(trip, comment, participantId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldBeAbleToDeleteTripOwnerCommennt(t *testing.T) {
	tripOwnerId := "id-123"
	editorId := "id-456"
	trip := &dto.Trip{
		OwnerID: tripOwnerId,
		Participants: []dto.TripUser{
			{
				ID:   editorId,
				Role: "editor",
			},
		},
	}

	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: tripOwnerId},
		Content: "Test comment",
	}

	expected := true
	actual := canDeleteComment(trip, comment, editorId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldBeAbleToDeleteTheirComment(t *testing.T) {
	tripOwnerId := "id-123"
	editorId := "id-456"
	trip := &dto.Trip{
		OwnerID: tripOwnerId,
		Participants: []dto.TripUser{
			{
				ID:   editorId,
				Role: "editor",
			},
		},
	}

	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: editorId},
		Content: "Test comment",
	}

	expected := true
	actual := canDeleteComment(trip, comment, editorId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldBeAbleToDeleteOtherEditorComment(t *testing.T) {
	tripOwnerId := "id-123"
	editorId := "id-456"
	trip := &dto.Trip{
		OwnerID: tripOwnerId,
		Participants: []dto.TripUser{
			{
				ID:   editorId,
				Role: "editor",
			},
			{
				ID:   "id-789",
				Role: "editor",
			},
		},
	}

	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: "id-789"},
		Content: "Test comment",
	}

	expected := true
	actual := canDeleteComment(trip, comment, editorId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldBeAbleToDeleteParticipantComment(t *testing.T) {
	tripOwnerId := "id-123"
	editorId := "id-456"
	participantId := "id-789"

	trip := &dto.Trip{
		OwnerID: tripOwnerId,
		Participants: []dto.TripUser{
			{
				ID:   editorId,
				Role: "editor",
			},
			{
				ID:   participantId,
				Role: "participant",
			},
		},
	}

	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: participantId},
		Content: "Test comment",
	}

	expected := true
	actual := canDeleteComment(trip, comment, editorId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestParticipantShouldNotBeAbleToDeleteOwnerComment(t *testing.T) {
	tripOwnerId := "id-123"
	editorId := "id-456"
	participantId := "id-789"

	trip := &dto.Trip{
		OwnerID: tripOwnerId,
		Participants: []dto.TripUser{
			{
				ID:   editorId,
				Role: "editor",
			},
			{
				ID:   participantId,
				Role: "participant",
			},
		},
	}

	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: tripOwnerId},
		Content: "Test comment",
	}

	expected := false
	actual := canDeleteComment(trip, comment, participantId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestParticipantShouldNotBeAbleToDeleteEditorComment(t *testing.T) {
	tripOwnerId := "id-123"
	editorId := "id-456"
	participantId := "id-789"

	trip := &dto.Trip{
		OwnerID: tripOwnerId,
		Participants: []dto.TripUser{
			{
				ID:   editorId,
				Role: "editor",
			},
			{
				ID:   participantId,
				Role: "participant",
			},
		},
	}

	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: editorId},
		Content: "Test comment",
	}

	expected := false
	actual := canDeleteComment(trip, comment, participantId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestParticipantShouldBeAbleToDeleteTheirComment(t *testing.T) {
	tripOwnerId := "id-123"
	editorId := "id-456"
	participantId := "id-789"

	trip := &dto.Trip{
		OwnerID: tripOwnerId,
		Participants: []dto.TripUser{
			{
				ID:   editorId,
				Role: "editor",
			},
			{
				ID:   participantId,
				Role: "participant",
			},
		},
	}

	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: participantId},
		Content: "Test comment",
	}

	expected := true
	actual := canDeleteComment(trip, comment, participantId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestParticipantShouldNotBeAbleToDeleteOtherParticipantComment(t *testing.T) {
	tripOwnerId := "id-123"
	editorId := "id-456"
	participantId := "id-789"
	otherParticipantId := "id-012"

	trip := &dto.Trip{
		OwnerID: tripOwnerId,
		Participants: []dto.TripUser{
			{
				ID:   editorId,
				Role: "editor",
			},
			{
				ID:   participantId,
				Role: "participant",
			},
			{
				ID:   otherParticipantId,
				Role: "participant",
			},
		},
	}

	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: otherParticipantId},
		Content: "Test comment",
	}

	expected := false
	actual := canDeleteComment(trip, comment, participantId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldNotBeAbleToRemoveOwnerComment(t *testing.T) {
	tripOwnerId := "id-123"
	nonParticipantId := "id-012"

	trip := &dto.Trip{
		OwnerID: tripOwnerId,
	}

	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: tripOwnerId},
		Content: "Test comment",
	}

	expected := false
	actual := canDeleteComment(trip, comment, nonParticipantId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldNotBeAbleToRemoveEditorComment(t *testing.T) {
	tripOwnerId := "id-123"
	editorId := "id-456"
	nonParticipantId := "id-012"

	trip := &dto.Trip{
		OwnerID: tripOwnerId,
		Participants: []dto.TripUser{
			{
				ID:   editorId,
				Role: "editor",
			},
		},
	}

	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: editorId},
		Content: "Test comment",
	}

	expected := false
	actual := canDeleteComment(trip, comment, nonParticipantId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldNotBeAbleToRemoveParticipantComment(t *testing.T) {
	tripOwnerId := "id-123"
	editorId := "id-456"
	participantId := "id-789"
	nonParticipantId := "id-012"

	trip := &dto.Trip{
		OwnerID: tripOwnerId,
		Participants: []dto.TripUser{
			{
				ID:   editorId,
				Role: "editor",
			},
			{
				ID:   participantId,
				Role: "participant",
			},
		},
	}

	comment := &dto.TripComment{
		ID:      "comment-123",
		From:    dto.TripUser{ID: participantId},
		Content: "Test comment",
	}

	expected := false
	actual := canDeleteComment(trip, comment, nonParticipantId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOwnerShouldBeAbleToManageAmenities(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
	}

	userId := "id-123"

	expected := true
	actual := canManageAmenities(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldBeAbleToManageAmenities(t *testing.T) {
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
	actual := canManageAmenities(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestParticipantShouldNotBeAbleToManageAmenities(t *testing.T) {
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
	actual := canManageAmenities(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldNotBeAbleToManageAmenities(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
	}

	userId := "id-789"

	expected := false
	actual := canManageAmenities(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOwnerShouldBeAbleToUpdateTrip(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
	}

	userId := "id-123"

	expected := true
	actual := canUpdateTrip(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldNotBeAbleToUpdateTrip(t *testing.T) {
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

	expected := false
	actual := canUpdateTrip(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestParticipantShouldNotBeAbleToUpdateTrip(t *testing.T) {
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
	actual := canUpdateTrip(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldNotBeAbleToUpdateTrip(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
	}

	userId := "id-789"

	expected := false
	actual := canUpdateTrip(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOwnerShouldBeAbleToCreateLocation(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
	}

	userId := "id-123"

	expected := true
	actual := canCreateLocation(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldBeAbleToCreateLocation(t *testing.T) {
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
	actual := canCreateLocation(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestParticipantShouldNotBeAbleToCreateLocation(t *testing.T) {
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
	actual := canCreateLocation(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldNotBeAbleToCreateLocation(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
	}

	userId := "id-789"

	expected := false
	actual := canCreateLocation(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOwnerShouldBeAbleToUpdateTripLocation(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
	}

	userId := "id-123"

	expected := true
	actual := canUpdateTripLocation(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldBeAbleToUpdateTripLocation(t *testing.T) {
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
	actual := canUpdateTripLocation(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestParticipantShouldNotBeAbleToUpdateTripLocation(t *testing.T) {
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
	actual := canUpdateTripLocation(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldNotBeAbleToUpdateTripLocation(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
	}

	userId := "id-789"

	expected := false
	actual := canUpdateTripLocation(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestOwnerShouldBeAbleToDeleteTripLocation(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
	}

	userId := "id-123"

	expected := true
	actual := canDeleteTripLocation(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestEditorShouldBeAbleToDeleteTripLocation(t *testing.T) {
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
	actual := canDeleteTripLocation(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestParticipantShouldNotBeAbleToDeleteTripLocation(t *testing.T) {
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
	actual := canDeleteTripLocation(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}

func TestNonParticipantShouldNotBeAbleToDeleteTripLocation(t *testing.T) {
	trip := &dto.Trip{
		OwnerID: "id-123",
	}

	userId := "id-789"

	expected := false
	actual := canDeleteTripLocation(trip, userId)
	assert.Equal(t, expected, actual, "they should be equal")
}
