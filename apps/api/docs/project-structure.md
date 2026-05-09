# Project Structure

This document describes the project structure of the Wanderlust API.

## Structure

```
.
│
├── docs (Documentation)
│
└── src (Source)
    ├── db
    │   └── schema
    │
    ├── lib
    │   ├── auth
    │   ├── cache
    │   ├── config
    │   ├── context
    │   ├── di
    │   ├── email
    │   ├── err
    │   ├── fake
    │   ├── jobs
    │   ├── pagination
    │   ├── pgerr
    │   ├── search
    │   ├── storage
    │   └── uid
    │
    ├── middlewares
    │
    ├── routes
    │   ├── aggregator
    │   └── amenities
    │   ...
    │   ...
    │   ...
    │
    ├── scripts
    │
    └── templates
```

## Notes

- Most important directories are `src/lib` and `src/routes`.
- If it's related to routing (or you can call it handlers, controllers, etc.), it goes to `src/routes`.
- If it's meant to be used by other packages and by application code, it goes to `src/lib`.
