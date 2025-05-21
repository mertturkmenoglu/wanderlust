# Architecture

- We are not following any particular software architecture style like DDD, clean, vertical slice, tiered, hexagonal, etc.
- You can see the concepts of DDD, vertical slice, and tiered (n-layer) architectures applied to this project.
- Each subfolder in the `app` folder losely represents a domain object. `module.go` file contains the router (controller), `service.go` file contains the business logic.
- But to keep modules separate (loose coupling), DTO (data transfer object) files are kept in the `pkg/dto` folder.
- And also all the database objects are kept in the `pkg/db` folder.
- Project is mainly divided into three groups:
  - `app`: Contains the domain objects (modules).
  - `cmd`: Contains runnables.
  - `pkg`: Contains the libraries.

## Code Flow

- You should start reviewing the project by first inspecting the `cmd/core/main.go` file.
- This is the entry point of the application.
- Each module is registered through the `cmd/core/bootstrap/modules.go` file `RegisterRoutes` function.
- Each module inside the `app` folder has its own `module.go` file and in it, the `Register` function.
- You can find the route handlers in each module's `module.go` file.
- References to shared modules instances are kept in a `core.Application` struct.
- Every module gets a pointer reference to the application libraries (shared modules/libraries).
- Each module defines its own `service.go` file and in it, the `Service` struct.
- This service struct gets the pointer to `core.Application` struct.

