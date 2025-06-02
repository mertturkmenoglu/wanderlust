	echo "=> Setting up the project..."
	go mod download
	just env-pull
	just docker
	goose up
	just sqlc
	echo "=> Setup completed. Run 'just watch' to start the server."