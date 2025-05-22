package diary

import "wanderlust/pkg/dto"

func (s *Service) canRead(entry *dto.DiaryEntry, userId string) bool {
	if entry.UserID == userId {
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
