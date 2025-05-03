package main

import "math/rand"

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
