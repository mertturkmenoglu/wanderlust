package main

import (
	"context"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/hash"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/jackc/pgx/v5/pgtype"
)

func handleUsers(count int) error {
	logger.Trace("handling users. generating", logger.Args("count", count))
	var imageUrls = []string{
		"https://imgur.com/5F9jdqG",
		"https://imgur.com/PLOjI55",
		"https://imgur.com/JYnxkQM",
		"https://imgur.com/Y3ujIqE",
		"https://imgur.com/7oSGh9R",
		"https://imgur.com/Q4xKlfx",
		"https://imgur.com/8VXj0Pt",
		"https://imgur.com/pb24GMQ",
		"https://imgur.com/nOtUKhM",
		"https://imgur.com/f6VKpRj",
		"https://imgur.com/EwvUEmR",
		"https://imgur.com/DOgJY3o",
		"https://imgur.com/mrAicIB",
		"https://imgur.com/wGD07jx",
		"https://imgur.com/1mn0i08",
		"https://imgur.com/sc4r21z",
		"https://imgur.com/0fsRZC9",
		"https://imgur.com/Ivsxi5b",
		"https://imgur.com/opsngDD",
		"https://imgur.com/FKlIkC5",
		"https://imgur.com/2XI5t0u",
		"https://imgur.com/XFG5Q7R",
		"https://imgur.com/H6F5qND",
		"https://imgur.com/OlOa85q",
		"https://imgur.com/nX7JSRq",
		"https://imgur.com/Bpj7Rlw",
		"https://imgur.com/0hYMpwI",
		"https://imgur.com/CNtFbZT",
		"https://imgur.com/SnP70MO",
		"https://imgur.com/mWzmPRv",
	}

	ctx := context.Background()
	d := GetDb()
	h, err := hash.Hash("LoremIpsum!1")

	if err != nil {
		return err
	}

	step := 1000

	if count < step {
		step = count
	}

	for i := 0; i < count; i += step {
		if i%step == 0 {
			logger.Trace("Inserting users", logger.Args("index", i))
		}
		if i+step >= count {
			step = count - i
		}

		arg := make([]db.BatchCreateUsersParams, 0, step)

		for range step {
			arg = append(arg, db.BatchCreateUsersParams{
				ID:                    gofakeit.UUID(),
				Email:                 gofakeit.LetterN(4) + gofakeit.Email(),
				Username:              gofakeit.Username() + gofakeit.LetterN(3),
				FullName:              gofakeit.Name(),
				PasswordHash:          pgtype.Text{String: h, Valid: true},
				GoogleID:              pgtype.Text{Valid: false},
				FbID:                  pgtype.Text{Valid: false},
				IsOnboardingCompleted: true,
				IsEmailVerified:       true,
				ProfileImage:          pgtype.Text{String: gofakeit.RandomString(imageUrls), Valid: true},
			})
		}

		_, err := d.Queries.BatchCreateUsers(ctx, arg)

		if err != nil {
			return err
		}
	}

	return nil
}
