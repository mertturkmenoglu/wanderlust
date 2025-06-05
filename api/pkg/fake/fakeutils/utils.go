package fakeutils

import (
	"bufio"
	"fmt"
	"math/rand"
	"os"

	"github.com/pterm/pterm"
)

func RandElem[T any](arr []T) T {
	return arr[rand.Intn(len(arr))]
}

func RandElems[T any](arr []T, n int) []T {
	newArr := make([]T, len(arr))
	copy(newArr, arr)

	rand.Shuffle(len(newArr), func(i, j int) {
		newArr[i], newArr[j] = newArr[j], newArr[i]
	})

	return newArr[0:n]
}

// A shorter alias for pterm.DefaultInteractiveTextInput.Show
func Input(text ...string) (string, error) {
	return pterm.DefaultInteractiveTextInput.Show(text...)
}

func ReadFile(path string) ([]string, error) {
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

func GetChunkCount(arrlen int, bathcSize int) int {
	// Get how many chunks there are
	chunkCount := arrlen / bathcSize

	// If there are any leftovers, add them to the last chunk
	if arrlen%bathcSize != 0 {
		chunkCount++
	}

	return chunkCount
}

func CombineErrors(errchan chan error) error {
	var combinedErr error
	for err := range errchan {
		if combinedErr == nil {
			combinedErr = err
		} else {
			combinedErr = fmt.Errorf("%w; %v", combinedErr, err)
		}
	}
	return combinedErr
}
