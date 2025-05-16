package cfg

import (
	"os"
	"reflect"
	"strconv"
)

func InitConfigurationStruct() {
	envType := reflect.TypeOf(Env)

	for i := range envType.NumField() {
		field := envType.Field(i)
		key := field.Tag.Get("key")
		fieldTypeStr := field.Type.String()

		if key == "" {
			panic("Environment variable key not set for field " + field.Name)
		}

		if fieldTypeStr == "string" {
			reflect.ValueOf(&Env).Elem().FieldByName(field.Name).SetString(GetString(key))
		} else if fieldTypeStr == "int" || fieldTypeStr == "int32" || fieldTypeStr == "int64" {
			reflect.ValueOf(&Env).Elem().FieldByName(field.Name).SetInt(int64(GetInt(key)))
		} else if fieldTypeStr == "bool" {
			reflect.ValueOf(&Env).Elem().FieldByName(field.Name).SetBool(GetBool(key))
		} else {
			panic("Environment variable type not supported for field " + field.Name)
		}
	}
}

// Retrieve an environment variable by its key.
// If the variable is not set, it panics with a message.
func GetString(key string) string {
	val, ok := os.LookupEnv(key)

	if !ok {
		panic("Environment variable " + key + " is not set")
	}

	return val
}

// Retrieve an integer environment variable by its key.
func GetInt(key string) int {
	val, ok := os.LookupEnv(key)

	if !ok {
		panic("Environment variable " + key + " is not set")
	}

	intVal, err := strconv.Atoi(val)

	if err != nil {
		panic("Environment variable " + key + " is not a valid integer")
	}

	return intVal
}

// Retrieve a boolean environment variable by its key.
func GetBool(key string) bool {
	val, ok := os.LookupEnv(key)

	if !ok {
		panic("Environment variable " + key + " is not set")
	}

	boolVal, err := strconv.ParseBool(val)

	if err != nil {
		panic("Environment variable " + key + " is not a valid boolean")
	}

	return boolVal
}
