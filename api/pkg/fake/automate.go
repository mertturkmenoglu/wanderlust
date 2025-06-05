package fake

import (
	"fmt"
	"os/exec"
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
	"amenities",
	"categories",
	"cities",
	"addresses",
	"users",
	"pois",
	"fake-id", // run fake id to get user and poi ids
	"amenities-pois",
	"media-for-many-pois",
	"follows",
	"reviews",
	"fake-id", // run fake id again to get review ids
	"review-media",
	"collections",
	"fake-id", // run fake id again to get collection ids
	"collection-items",
	"collections-cities",
	"collections-pois",
	"lists",
	"fake-id", // run fake id again to get list ids
	"list-items",
}

func Automate() error {
	f := handlers.NewFake()
	automationStart := time.Now()

	for _, step := range steps {
		spinner, _ := pterm.DefaultSpinner.Start("Generating: " + step)
		start := time.Now()

		err := mux(f, step)

		elapsed := time.Since(start)

		if err != nil {
			spinner.Fail("Failed to generate: " + step)
			return err
		} else {
			spinner.Success()
		}

		f.Logger.Info("=> Elapsed time: " + elapsed.String())
	}

	totalElapsed := time.Since(automationStart)
	f.Logger.Info("=> Total Elapsed time: " + totalElapsed.String())

	return nil
}

func mux(f *handlers.Fake, t string) error {
	switch t {
	case "addresses":
		return f.HandleAddresses(10_000)
	case "amenities":
		return f.HandleAmenities()
	case "amenities-pois":
		return f.HandleAmenitiesPois(poisPath)
	case "categories":
		return f.HandleCategories()
	case "cities":
		return f.HandleCities()
	case "collections":
		return f.HandleCollections(10_000)
	case "collection-items":
		return f.HandleCollectionItems(collectionsPath, poisPath)
	case "collections-cities":
		return f.HandleCollectionsCities(collectionsPath)
	case "collections-pois":
		return f.HandleCollectionsPois(collectionsPath, poisPath)
	case "fake-id":
		return exec.Command("just", "fake-id").Run()
	case "follows":
		return f.HandleFollows(usersPath)
	case "lists":
		return f.HandleLists(usersPath)
	case "list-items":
		return f.HandleListItems(listsPath, poisPath)
	case "media-for-many-pois":
		return f.HandleMediaForManyPois(poisPath)
	case "pois":
		return f.HandlePois(10_000)
	case "reviews":
		return f.HandleReviews(poisPath, usersPath)
	case "review-media":
		return f.HandleReviewMedia(reviewsPath)
	case "users":
		return f.HandleUsers(10_000)
	default:
		return fmt.Errorf("invalid task type: %s", t)
	}
}
