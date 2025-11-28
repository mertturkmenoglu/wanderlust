# Justfile

- We are using Justfile to make typing CLI commands and remembering things easier.
- An example usage: `just watch`

## Just Commands

To get a list of all available commands and their descriptions, run `just --list`.

## Conventions

- You can see that there are multiple `justfile` files in the project.
- Each subpoject has its own `justfile`.
- The file in the root directory is the main one.
- When you only want to run a command in a specific subproject, use that project's `justfile`.
- Each subproject `justfile` has 3 common commands:
  - `default`: This is the default command, it just gives you a list of all available commands.
  - `setup`: This command sets up the project.
  - `watch`: This command starts a development server.
- Other than these 3 commands, each subproject can have different commands.
