# Wanderlust Feature Flags Service

This service is used to manage feature flags for the Wanderlust application.

## Usage

To use the service, copy the content of `.env.example` to `.env` and fill in the values.

## Development

- Install [just](https://github.com/casey/just)
- Run `just setup` to install dependencies.
- Run `just watch` to start the development server.

## Endpoints

### GET /flags

This endpoint returns the current state of the feature flags.

### POST /flags

This endpoint updates the feature flags. You must provide all the flags and the version.
