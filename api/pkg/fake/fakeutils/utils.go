package fakeutils

import (
	"bufio"
	"crypto/rand"
	"errors"
	"fmt"
	"math/big"
	randV2 "math/rand/v2"
	"os"
	"strings"

	"github.com/pterm/pterm"
)

func RandElem[T any](arr []T) T {
	x, err := rand.Int(rand.Reader, big.NewInt(int64(len(arr))))

	if err != nil {
		panic("cannot generate random number: " + err.Error())
	}

	return arr[x.Int64()]
}

func RandElems[T any](arr []T, n int32) []T {
	newArr := make([]T, len(arr))
	copy(newArr, arr)

	randV2.Shuffle(len(newArr), func(i, j int) {
		newArr[i], newArr[j] = newArr[j], newArr[i]
	})

	return newArr[0:n]
}

// A shorter alias for pterm.DefaultInteractiveTextInput.Show
func Input(text ...string) (string, error) {
	return pterm.DefaultInteractiveTextInput.Show(text...)
}

func ReadFile(path string) ([]string, error) {
	if !strings.HasPrefix(path, "tmp/") {
		return nil, errors.New("you must read a file from the tmp/ directory")
	}

	f, err := os.Open(path) // #nosec G304 -- this is a development time util, paths are safe

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
