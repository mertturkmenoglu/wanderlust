	echo "=> Setting up the project..."
	go mod download
	just env-pull
	goose up
	just sqlc
	just docker
	echo "=> Setup completed. Run 'just watch' to start the server."