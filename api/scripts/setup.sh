#!/bin/env bash

echo "=> Setting up the project..."
go mod download
just env
echo "=> Environment variables set but some required values are missing. Please fill the missing values in .env file."
just docker
goose up
just sqlc
mkdir -p ./tmp
echo "=> Setup completed. Run 'just watch' to start the server."