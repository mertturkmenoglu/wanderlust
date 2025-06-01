package diaries

import "wanderlust/pkg/dto"

func isOwner(diary *dto.Diary, userId string) bool {
	return diary.UserID == userId
}

func canRead(diary *dto.Diary, userId string) bool {
	if isOwner(diary, userId) {
		return true
	}

	if !diary.ShareWithFriends {
		return false
	}

	for _, friend := range diary.Friends {
		if friend.ID == userId {
			return true
		}
	}

	return false
}

func canUpdate(diary *dto.Diary, userId string) bool {
	return isOwner(diary, userId)
}

func canDelete(diary *dto.Diary, userId string) bool {
	return isOwner(diary, userId)
}
