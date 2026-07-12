# CLI

You can use the CLI tool to fullfill development tasks. Example usage:

```bash
bun wl doctor
```

## Commands

- `adr`: Create a new ADR (Architecture Decision Record) document from the template. Example usage:

```bash
bun wl adr --title "Use Bun for the project"
```

- `clean`: Remove and recreate all Docker containers (and volumes), push database schema, setup SeaweedFS buckets and policies. Example usage:

```bash
bun wl clean
```

- `doctor`: Check the dependencies and environment for potential issues. Example usage:

```bash
bun wl doctor
```

- `echo`: Echo the provided arguments. Example usage:

```bash
bun wl echo "Hello, World!"
```

- `fake`: Generate fake data. Example usage:

```bash
bun wl fake
```

- `map-styles`: Fetch the map styles from the Maptiler GitHub repository and output them in a file. Example usage:

```bash
bun wl map-styles
```

- `scaffold`: Scaffold a new feature in the project by creating contract and API files. Example usage:

```bash
bun wl scaffold squirrel
```

- `sync`: Sync the Typsense search index with the primary database. Example usage:

```bash
bun wl sync
```

For more details, use the `--help` flag with any command to see its options and usage instructions.
