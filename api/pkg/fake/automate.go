package fake

import (
	"fmt"
	"time"
	"wanderlust/pkg/fake/handlers"

	"github.com/pterm/pterm"
)

const (
	poisPath        = "tmp/pois.txt"
	usersPath       = "tmp/users.txt"
	reviewsPath     = "tmp/reviews.txt"
	collectionsPath = "tmp/collections.txt"
	listsPath       = "tmp/lists.txt"
)

var steps = [...]string{
	"categories",
	"cities",
	"addresses",
	"users",
	"pois",
	"fake-id", // run fake id to get user and poi ids
	"images",
	"follows",
	"reviews",
	"fake-id", // run fake id again to get review ids
	"review-images",
	"collections",
	"fake-id", // run fake id again to get collection ids
	"collection-items",
	"collections-cities",
	"collections-pois",
	"lists",
	"fake-id", // run fake id again to get list ids
	"list-items",
	"favorites",
	"bookmarks",
}

func Automate() error {
	f := handlers.NewFake()

	fakers := map[string]handlers.IFaker{
		"addresses": &handlers.FakeAddresses{
			Count: 10_000,
			Step:  1000,
			Fake:  f,
		},
		"bookmarks": &handlers.FakeBookmarks{
			UsersPath: usersPath,
			PoisPath:  poisPath,
			Fake:      f,
		},
		"categories": &handlers.FakeCategories{
			Fake: f,
		},
		"cities": &handlers.FakeCities{
			Fake: f,
		},
		"collections": &handlers.FakeCollections{
			Fake: f,
		},
		"collection-items": &handlers.FakeCollectionItems{
			CollectionsPath: collectionsPath,
			PoisPath:        poisPath,
			Fake:            f,
		},
		"collections-cities": &handlers.FakeCollectionsCities{
			CollectionsPath: collectionsPath,
			Fake:            f,
		},
		"collections-pois": &handlers.FakeCollectionsPois{
			CollectionsPath: collectionsPath,
			PoisPath:        poisPath,
			Fake:            f,
		},
		"fake-id": &handlers.FakeID{},
		"favorites": &handlers.FakeFavorites{
			UsersPath: usersPath,
			PoisPath:  poisPath,
			Fake:      f,
		},
		"follows": &handlers.FakeFollows{
			UsersPath: usersPath,
			Fake:      f,
		},
		"images": &handlers.FakeImages{
			PoisPath: poisPath,
			Fake:     f,
		},
		"lists": &handlers.FakeLists{
			UsersPath: usersPath,
			Fake:      f,
		},
		"list-items": &handlers.FakeListItems{
			ListsPath: listsPath,
			PoisPath:  poisPath,
			Fake:      f,
		},
		"pois": &handlers.FakePois{
			Count: 10_000,
			Step:  1000,
			Fake:  f,
		},
		"reviews": &handlers.FakeReviews{
			PoisPath:  poisPath,
			UsersPath: usersPath,
			Fake:      f,
		},
		"review-images": &handlers.FakeReviewImages{
			ReviewsPath: reviewsPath,
			Fake:        f,
		},
		"users": &handlers.FakeUsers{
			Count: 10_000,
			Step:  1000,
			Fake:  f,
		},
	}

	automationStart := time.Now()

	for _, step := range steps {
		spinner, _ := pterm.DefaultSpinner.Start("Generating: " + step)
		start := time.Now()

		count, err := mux(fakers, step)

		elapsed := time.Since(start)

		if err != nil {
			spinner.Fail("Failed to generate: " + step)
			return err
		} else {
			spinner.Success()
		}

		f.Logger.Info("Generated: ", f.Logger.ArgsFromMap(map[string]any{
			"step":  step,
			"count": count,
			"time":  elapsed,
		}))
	}

	totalElapsed := time.Since(automationStart)
	f.Logger.Info("=> Total Elapsed time: " + totalElapsed.String())

	return nil
}

func mux(f map[string]handlers.IFaker, step string) (int64, error) {
	faker, ok := f[step]

	if !ok {
		return 0, fmt.Errorf("invalid task type: %s", step)
	}

	return faker.Generate()
}
