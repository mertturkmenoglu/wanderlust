package cfg

import (
	"os"
	"strconv"
)

// Retrieve an environment variable by its key.
// If the variable is not set, it panics with a message.
func Get(key EnvKey) string {
	val, ok := os.LookupEnv(string(key))

	if !ok {
		panic("Environment variable " + string(key) + " is not set")
	}

	return val
}

// Retrieve an integer environment variable by its key.
func GetInt(key EnvKey) int {
	val, ok := os.LookupEnv(string(key))

	if !ok {
		panic("Environment variable " + string(key) + " is not set")
	}

	intVal, err := strconv.Atoi(val)

	if err != nil {
		panic("Environment variable " + string(key) + " is not a valid integer")
	}

	return intVal
}

// Retrieve a boolean environment variable by its key.
func GetBool(key EnvKey) bool {
	val, ok := os.LookupEnv(string(key))

	if !ok {
		panic("Environment variable " + string(key) + " is not set")
	}

	boolVal, err := strconv.ParseBool(val)

	if err != nil {
		panic("Environment variable " + string(key) + " is not a valid boolean")
	}

	return boolVal
}
