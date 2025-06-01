package diary

import "wanderlust/pkg/dto"

func isOwner(entry *dto.Diary, userId string) bool {
	return entry.UserID == userId
}

func canRead(entry *dto.Diary, userId string) bool {
	if isOwner(entry, userId) {
		return true
	}

	if !entry.ShareWithFriends {
		return false
	}

	for _, friend := range entry.Friends {
		if friend.ID == userId {
			return true
		}
	}

	return false
}

func canUpdate(entry *dto.Diary, userId string) bool {
	return isOwner(entry, userId)
}

func canDelete(entry *dto.Diary, userId string) bool {
	return isOwner(entry, userId)
}
