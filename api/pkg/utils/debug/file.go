package debug

import (
	"encoding/json"
	"log"
	"os"
)

// Write anything to a temporary JSON file
func WriteJson(tag string, v any) {
	serialized, err := json.Marshal(v)

	if err != nil {
		log.Println("failed to marshal", err)
		return
	}

	f, err := os.Create("tmp/" + tag + ".json")

	if err != nil {
		log.Println("failed to create file", err)
		return
	}

	defer f.Close()

	_, err = f.Write(serialized)

	if err != nil {
		log.Println("failed to write to file", err)
		return
	}
}
