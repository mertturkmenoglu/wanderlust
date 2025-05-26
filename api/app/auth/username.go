package auth

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"wanderlust/pkg/db"
	"wanderlust/pkg/random"
	"wanderlust/pkg/tracing"

	"github.com/jackc/pgx/v5"
)

func generateUsernameFromEmail(ctx context.Context, db *db.Db, email string) (string, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	localPart := strings.Split(email, "@")[0]
	validLocalPart := cleanEmailLocalPart(localPart)

	// Check if a user with validLocalPart username exists
	_, err := db.Queries.GetUserByUsername(ctx, validLocalPart)

	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			// Something else happened. Abort.
			sp.RecordError(err)
			return "", err
		}

		if !isValidUsername(validLocalPart) {
			// Username is not valid
			return "", fmt.Errorf("username %s is not valid", validLocalPart)
		}

		// Username is valid and there is no user
		// with this username.
		// We can use this username.
		return validLocalPart, nil
	}

	// There's already a user with this username.
	// Append random string at the end of validLocalPart.
	var base = validLocalPart

	if len(validLocalPart) > 24 {
		base = validLocalPart[0:24]
	}

	newStr := base + random.FromLetters(8)

	if !isValidUsername(newStr) {
		// Username is not valid
		return "", fmt.Errorf("username %s is not valid", newStr)
	}

	_, err = db.Queries.GetUserByUsername(ctx, newStr)

	if err != nil {
		return "", fmt.Errorf("username %s is already taken", newStr)
	}

	return newStr, nil
}

func cleanEmailLocalPart(localPart string) string {
	var validLocalPart = ""

	for _, r := range localPart {
		if isAllowedRune(r) {
			validLocalPart = fmt.Sprintf("%s%c", validLocalPart, r)
		}
	}

	return validLocalPart
}
