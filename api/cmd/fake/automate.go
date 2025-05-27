package main

import "os/exec"

func automate() error {
	var poisPath = "tmp/pois.txt"
	var usersPath = "tmp/users.txt"

	logger.Info("Starting automated generation")

	err := handleAmenities()

	if err != nil {
		return err
	}

	err = handleCategories()

	if err != nil {
		return err
	}

	err = handleCities()

	if err != nil {
		return err
	}

	err = handleAddresses(10_000)

	if err != nil {
		return err
	}

	err = handleUsers(10_000)

	if err != nil {
		return err
	}

	err = handlePois(10_000)

	if err != nil {
		return err
	}

	cmd := exec.Command("just", "fake-id")
	err = cmd.Run()

	if err != nil {
		return err
	}

	err = handleAmenitiesPois(poisPath)

	if err != nil {
		return err
	}

	err = handleMediaForManyPois(poisPath)

	if err != nil {
		return err
	}

	err = handleFollows(usersPath)

	logger.Info("Automated generation completed.")

	return err
}
