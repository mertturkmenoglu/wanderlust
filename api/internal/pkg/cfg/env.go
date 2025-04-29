package cfg

import "os"

// Retrieve an environment variable by its key.
// If the variable is not set, it panics with a message.
func Get(key EnvKey) string {
	val, ok := os.LookupEnv(string(key))

	if !ok {
		panic("Environment variable " + string(key) + " is not set")
	}

	return val
}
