package tasks

import (
	"encoding/json"
	"log"
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/email"
	"wanderlust/pkg/upload"

	"github.com/hibiken/asynq"
)

type Tasks struct {
	Client *asynq.Client
	email  *email.EmailService
	upload *upload.Upload
	addr   string
}

func New(emailService *email.EmailService, upload *upload.Upload) *Tasks {
	addr := cfg.Get(cfg.REDIS_ADDR)
	return &Tasks{
		Client: asynq.NewClient(asynq.RedisClientOpt{
			Addr: addr,
		}),
		email:  emailService,
		upload: upload,
		addr:   addr,
	}
}

func (t *Tasks) Run() {
	srv := asynq.NewServer(
		asynq.RedisClientOpt{
			Addr: t.addr,
		},
		asynq.Config{
			Concurrency: 10,
		},
	)

	mux := asynq.NewServeMux()

	t.registerHandlers(mux)

	if err := srv.Run(mux); err != nil {
		log.Fatalf("could not run asynq server: %v", err)
	}
}

func (t *Tasks) registerHandlers(mux *asynq.ServeMux) {
	mux.HandleFunc(TypeForgotPasswordEmail, t.HandleEmailForgotPasswordTask)
	mux.HandleFunc(TypeNewLoginAlertEmail, t.HandleNewLoginAlertEmailTask)
	mux.HandleFunc(TypeWelcomeEmail, t.HandleWelcomeEmailTask)
	mux.HandleFunc(TypePasswordResetEmail, t.HandlePasswordResetEmailTask)
	mux.HandleFunc(TypeVerifyEmailEmail, t.HandleVerifyEmailEmailTask)
	mux.HandleFunc(TypeDeleteDiaryMedia, t.HandleDeleteDiaryMediaTask)
}

func (t *Tasks) Close() {
	err := t.Client.Close()

	if err != nil {
		log.Fatalf("could not close asynq client: %v", err)
	}
}

func (t *Tasks) NewTask(taskType string, payload any) (*asynq.Task, error) {
	serialized, err := json.Marshal(payload)

	if err != nil {
		return nil, err
	}

	return asynq.NewTask(taskType, serialized), nil
}

func (t *Tasks) CreateAndEnqueue(taskType string, payload any, opts ...asynq.Option) (*asynq.TaskInfo, error) {
	newTask, err := t.NewTask(taskType, payload)

	if err != nil {
		return nil, err
	}

	return t.Client.Enqueue(newTask, opts...)
}

func parse[T Payload](serialized []byte) (*T, error) {
	var p T

	err := json.Unmarshal(serialized, &p)

	if err != nil {
		return nil, err
	}

	return &p, nil
}
