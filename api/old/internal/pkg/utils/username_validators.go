package utils

func isNumberRune(r rune) bool {
	return '0' <= r && r <= '9'
}

func isLetterRune(r rune) bool {
	return ('A' <= r && r <= 'Z') || ('a' <= r && r <= 'z')
}

func isUnderscoreRune(r rune) bool {
	return r == '_'
}

func isAllowedRune(r rune) bool {
	if isNumberRune(r) {
		return true
	}

	if isLetterRune(r) {
		return true
	}

	if isUnderscoreRune(r) {
		return true
	}

	return false
}

func isOnlyNumberString(str string) bool {
	for _, r := range str {
		if !isNumberRune(r) {
			return false
		}
	}

	return true
}

func isOnlyUnderscoresString(str string) bool {
	for _, r := range str {
		if !isUnderscoreRune(r) {
			return false
		}
	}

	return true
}

func containsConsecutiveUnderscores(str string) bool {
	consecutiveUnderscores := 0

	for _, r := range str {
		if isUnderscoreRune(r) {
			consecutiveUnderscores++
		} else {
			consecutiveUnderscores = 0
		}

		if consecutiveUnderscores > 1 {
			return true
		}
	}

	return false
}

// Check if the given str string is a valid username.
func IsValidUsername(str string) bool {
	// Check for length
	if len(str) < 4 || len(str) > 32 {
		return false
	}

	// Check for invalid characters
	for _, r := range str {
		if !isAllowedRune(r) {
			return false
		}
	}

	// Check for only numbers
	if isOnlyNumberString(str) {
		return false
	}

	// Check if only underscores
	if isOnlyUnderscoresString(str) {
		return false
	}

	// Check if contains consecutive underscores
	if containsConsecutiveUnderscores(str) {
		return false
	}

	return true
}
