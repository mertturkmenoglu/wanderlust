# Project Structure

This document describes the project structure of the Wanderlust API.

## Structure

```
|_ app ==> Controller layer
  |_ aggregator
  |_ amenities
  ...
  ...
  ...
|_ cmd
  |_ core ==> Core web api application
    |_ bootstrap ==> Bootstrap web application (init, middlewares, env loading, etc.)
  |_ fake ==> Fake data generator
  |_ search-sync ==> Sync search index
|_ conf ==> Configuration files
|_ docs ==> Documentation
|_ pkg ==> Packages used by other modules
  |_ activities
  |_ authz
  |_ cache
  ...
  ...
  ...
|_ templates ==> Email templates
```
