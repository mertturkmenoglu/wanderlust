#!/bin/env bash
commands=(
  "docker -v"
  "go version"
  "sqlc -v"
  "just -v"
  "air -v"
  "goose -version"
  "node --version"
  "pnpm --version"
  "infisical --version"
  "concurrently --version"
)

commandhelpers=(
  "https://docs.docker.com/desktop/setup/install/linux/ubuntu/"
  "https://go.dev/dl/"
  "https://sqlc.dev/"
  "https://github.com/casey/just"
  "https://github.com/air-verse/air"
  "https://github.com/pressly/goose"
  "https://nodejs.org/en/download"
  "https://pnpm.io/installation"
  "https://infisical.com/docs/documentation/getting-started/introduction"
  "https://www.npmjs.com/package/concurrently"
)

# Turn flag to false if any requirement fails
flag=0

for i in "${!commands[@]}"; do
  cmd="${commands[$i]}"
  cmdhelper="${commandhelpers[$i]}"
  cmdname="${cmd%% *}"
  
  if command -v $cmd > /dev/null; then
    echo -e "=> \033[32m[OK]\033[0m $cmdname"
  else
    flag=1
    echo -e "=> \033[31m[ERR]\033[0m $cmdname"
    echo "You can find installation instructions at $cmdhelper"
  fi
done

exit $flag
