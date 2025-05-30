package main

import (
	"fmt"
	"os/exec"
)

const (
	poisPath    = "tmp/pois.txt"
	usersPath   = "tmp/users.txt"
	reviewsPath = "tmp/reviews.txt"
)

var steps = [...]string{
	"amenities",
	"categories",
	"cities",
	"addresses",
	"users",
	"pois",
	"fake-id",
	"amenities-pois",
	"media-for-many-pois",
	"follows",
	"reviews",
	"fake-id", // run fake id again to get review ids
	"review-media",
}

func automate() error {
	logger.Info("Starting automated generation")

	for _, step := range steps {
		err := mux(step)
		if err != nil {
			return err
		}
	}

	logger.Info("Automated generation completed.")

	return nil
}

func mux(t string) error {
	switch t {
	case "amenities":
		return handleAmenities()
	case "categories":
		return handleCategories()
	case "cities":
		return handleCities()
	case "addresses":
		return handleAddresses(10_000)
	case "users":
		return handleUsers(10_000)
	case "pois":
		return handlePois(10_000)
	case "fake-id":
		return exec.Command("just", "fake-id").Run()
	case "amenities-pois":
		return handleAmenitiesPois(poisPath)
	case "media-for-many-pois":
		return handleMediaForManyPois(poisPath)
	case "follows":
		return handleFollows(usersPath)
	case "reviews":
		return handleReviews(poisPath, usersPath)
	case "review-media":
		return handleReviewMedia(reviewsPath)
	default:
		return fmt.Errorf("invalid task type: %s", t)
	}
}
