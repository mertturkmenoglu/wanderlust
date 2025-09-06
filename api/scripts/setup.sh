#!/bin/env bash

echo "=> Setting up the project..."
go mod download
just env
just docker
goose up
just sqlc
mkdir -p ./tmp
echo "=> Setup completed. Run 'just watch' to start the server."