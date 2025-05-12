# Project Structure

This document describes the project structure of the Wanderlust API.

## Structure

```
.
├── app (Domain Layer)
│   ├── aggregator
│   ├── amenities
│   ...
│   ...
│   ...
│
├── cmd (Runnables)
│   ├── core (Core Web API Server)
│   ├── fake (Fake Data Generator)
│   └── search-sync (Search Synchronizer)
├── conf (Configuration files)
├── docs (Documentation)
├── pkg (Library code)
│   ├── activities
│   ├── authz
│   ├── cache
│   ├── cfg
│   ├── core
│   ├── db (Database layer)
│   │   ├── migrations (Database migrations)
│   │   ├── queries (SQL Queries)
│   │   └── seed (Database seeders)
│   ...
│   ...
│   ...
│   └── utils (Utility functions)
└── templates (Email templates)
```
