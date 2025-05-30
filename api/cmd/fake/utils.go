package main

import (
	"bufio"
	"math/rand"
	"os"

	"github.com/pterm/pterm"
)

func randElem[T any](arr []T) T {
	return arr[rand.Intn(len(arr))]
}

func randElems[T any](arr []T, n int) []T {
	newArr := make([]T, len(arr))
	copy(newArr, arr)

	rand.Shuffle(len(newArr), func(i, j int) {
		newArr[i], newArr[j] = newArr[j], newArr[i]
	})

	return newArr[0:n]
}

// A shorter alias for pterm.DefaultInteractiveTextInput.Show
func input(text ...string) (string, error) {
	return pterm.DefaultInteractiveTextInput.Show(text...)
}

func readFile(path string) ([]string, error) {
	f, err := os.Open(path)

	if err != nil {
		return nil, err
	}

	defer f.Close()

	scanner := bufio.NewScanner(f)

	lines := make([]string, 0)

	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return lines, nil
}
