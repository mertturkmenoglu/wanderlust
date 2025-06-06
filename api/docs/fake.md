# Fake Data Generation

## Prerequisites

- Make sure your database is up and running.

## Running

- Run `just fake` command.
- This will run the Cobra command located in `pkg/commands/fake.go` file.
- It will generate data and insert into the database.

## Details

- If you want to generate data for a new resource, go to `pkg/fake/handlers` directory.
- Define a new struct for this resource.
- This struct should implement `IFaker` interface (located in `pkg/fake/handlers/fake.go`).
- You can embed `Fake` inside this struct to access underlying database connection and logger.

## Example Workflow

- Let's say you want to generate fake `Squirrels` data.
- Create `pkg/fake/handlers/squirrels.go` file.
- Define a new struct and embed `Fake`:

```go
type FakeSquirrels struct {
  *Fake
}
```

- This struct should implement `IFaker` interface:

```go
func (f *FakeSquirrels) Generate() (int64, error) {
  n := 10_000
  ctx := context.Background()

  for range n {
    _, err := f.db.Queries.CreateSquirrel(ctx, db.CreateSquirrelParams{
      ID: f.ID.Flake(),
      Name: gofakeit.Name(),
    })

    if err != nil {
      return 0, err
    }
  }

  return int64(n), nil
}
```

- Go to `pkg/fake/automate.go` file.
- Add the resource name to `steps` array.
- Create a new instance of `FakeSquirrels` struct inside the `Automate` function and add it to `fakers` hashmap.
