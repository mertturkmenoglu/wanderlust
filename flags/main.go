package main

import (
	"crypto/subtle"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/joho/godotenv"
)

type Flags struct {
	Version string         `json:"version"`
	Flags   map[string]any `json:"flags"`
}

func main() {
	err := godotenv.Load()

	if err != nil {
		log.Fatalln("Error loading .env file:", err)
	}

	flagsBytes, err := os.ReadFile("flags.json")

	if err != nil {
		log.Println("Error reading flags.json:", err)
	}

	var flags Flags

	if len(flagsBytes) == 0 {
		flags = Flags{
			Version: "v1",
			Flags:   make(map[string]any),
		}
	} else {
		err = json.Unmarshal(flagsBytes, &flags)

		if err != nil {
			log.Fatalln("Error parsing flags.json:", err)
		}
	}

	var mu sync.RWMutex

	mux := http.NewServeMux()

	mux.HandleFunc("GET /flags", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		mu.RLock()

		serialized, err := json.Marshal(flags)

		mu.RUnlock()

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(serialized)
	})

	mux.HandleFunc("POST /flags", func(w http.ResponseWriter, r *http.Request) {
		apiKeyHeader := r.Header.Get("x-api-key")

		if apiKeyHeader == "" {
			http.Error(w, "Missing API key", http.StatusUnauthorized)
			return
		}

		if subtle.ConstantTimeCompare([]byte(apiKeyHeader), []byte(os.Getenv("API_KEY"))) != 1 {
			http.Error(w, "Invalid API key", http.StatusForbidden)
			return
		}

		body, err := io.ReadAll(r.Body)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		mu.Lock()
		defer mu.Unlock()

		var data Flags

		err = json.Unmarshal(body, &data)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		flags = data

		err = os.WriteFile("flags.json", body, 0644)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Flags updated successfully"))
	})

	port, ok := os.LookupEnv("PORT")

	if !ok {
		port = "5001"
	}

	srv := http.Server{
		Addr:           ":" + port,
		Handler:        mux,
		ReadTimeout:    5 * time.Second,
		WriteTimeout:   5 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	log.Println("Starting server on port :" + port)

	if err := srv.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
