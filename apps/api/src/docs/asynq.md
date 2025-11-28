# Asynq

- We are using Asynq to handle background tasks.
- Asynq is a Go library for asynchronous task processing.

## Library

- Go to `pkg/tasks` directory.
- `tasks.go` file contains the main logic for handling tasks.
- `process_*.go` files contain the functions for processing tasks.

## Usage

- First, you must create new task type, its payload, and its handler function.
- Find (or create) the related processor file in `pkg/tasks` directory.
- Naming convention is: `process_{task type}.go`.
- Create type, payload, and handler. Example:

```go
const TypeMyNewTask = "foo:my-new-task"

type MyNewTaskPayload struct {
  Foo string
}

func (ts *TasksService) HandleMyNewTask(ctx context.Context, t *asynq.Task) error {
	p, err := parse[MyNewTaskPayload](t.Payload())

	if err != nil {
		return err
	}

  fmt.Println(p.Foo)

  return nil
}
```

- Then, you must register the handler in mux.
- Open `pkg/tasks/tasks.go` file.
- Inside the `NewMux` function, register the handler. Example:

```go
//
// Other handlers
//
mux.HandleFunc(TypeMyNewTask, t.HandleMyNewTask)
```

- Go to the file where you want to enqueue the task.
- You can use the `CreateAndEnqueue` method of the task service to enqueue the task.
- Example:

```go
t, err = s.Tasks.CreateAndEnqueue(tasks.Job{
  Type: tasks.TypeMyNewTask,
  Data: tasks.MyNewTaskPayload{
    Foo: "Foo Bar Baz",
  },
})
```

## Web UI

- `asynqmon` is the web UI for Asynq.
- Go to `http://localhost:8080` in your browser to access Asynq web UI.
