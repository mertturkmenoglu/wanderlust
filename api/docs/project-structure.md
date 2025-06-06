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
├── assets (Static assets)
├── conf (Configuration files)
├── docs (Documentation)
├── pkg (Library code)
│   ├── activities
│   ├── authz
│   ├── cache
│   ├── cfg
│   ├── commands (Cobra & Huma CLI commands)
│   ├── core
│   ├── db (Database layer)
│   │   ├── migrations (Database migrations)
│   │   ├── queries (SQL Queries)
│   │   └── seed (Database seeders)
│   ...
│   ...
│   ...
│   └── utils (Utility functions)
│
├── scripts (Bash scripts to automate some workflows)
├── templates (Email templates)
└── tests (End to End tests)
```

## Notes

- Most important directories are `app` and `pkg`.
- If it's related to routing (or you can call it handlers, controllers, etc.), it goes to `app`.
- If it's meant to be used by other packages and by application code (`app`), it goes to `pkg`.
