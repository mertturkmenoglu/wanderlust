# Build the application
all: build

build:
	@echo "Building..."

	@go build -o main cmd/core/main.go

# Run the application
run:
	@go run cmd/core/main.go

# Clean the binary
clean:
	@echo "Cleaning..."
	@rm -f main

# Live reload
watch:
	@if command -v air > /dev/null; then \
		RUN_MIGRATIONS=1 air -c conf/.air.toml; \
		echo "Watching...";\
	else \
		echo "Air is not installed. Run 'go install github.com/air-verse/air@latest' to install Air";\
	fi

generate-fake-data:
	@go run cmd/fake/*.go

sqlc-generate:
	@sqlc generate -f ./conf/sqlc.yaml

search-sync:
	@go run cmd/search-sync/*.go

create-migration:
	@read -p "Give migration a name: " migrationname; \
	migrate create -ext sql -dir internal/pkg/db/migrations -seq $$migrationname; \
	echo "Created migration with name $$migrationname. Update sql files."

.PHONY: all build run clean watch generate-fake-data sqlc-generate search-sync create-migration
