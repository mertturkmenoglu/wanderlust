package tasks

import (
	"encoding/json"
	"log"
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/mail"
	"wanderlust/pkg/upload"

	"github.com/hibiken/asynq"
)

type TasksService struct {
	client    *asynq.Client
	mailSvc   *mail.MailService
	uploadSvc *upload.UploadService
	addr      string
}

func New(mailSvc *mail.MailService, upload *upload.UploadService) *TasksService {
	return &TasksService{
		client: asynq.NewClient(asynq.RedisClientOpt{
			Addr: cfg.Env.RedisAddr,
		}),
		mailSvc:   mailSvc,
		uploadSvc: upload,
		addr:      cfg.Env.RedisAddr,
	}
}

func (t *TasksService) NewMux() *asynq.ServeMux {
	mux := asynq.NewServeMux()

	mux.HandleFunc(TypeForgotPasswordEmail, t.HandleEmailForgotPasswordTask)
	mux.HandleFunc(TypeNewLoginAlertEmail, t.HandleNewLoginAlertEmailTask)
	mux.HandleFunc(TypeWelcomeEmail, t.HandleWelcomeEmailTask)
	mux.HandleFunc(TypePasswordResetEmail, t.HandlePasswordResetEmailTask)
	mux.HandleFunc(TypeVerifyEmailEmail, t.HandleVerifyEmailEmailTask)
	mux.HandleFunc(TypeDeleteDiaryMedia, t.HandleDeleteDiaryMediaTask)

	return mux
}

func (t *TasksService) Run() {
	mux := t.NewMux()

	srv := asynq.NewServer(
		asynq.RedisClientOpt{
			Addr: t.addr,
		},
		asynq.Config{
			Concurrency: 10,
		},
	)

	if err := srv.Run(mux); err != nil {
		log.Fatalf("could not run asynq server: %v", err)
	}
}

func (t *TasksService) Close() {
	log.Println("Closing asynq client")
	err := t.client.Close()

	if err != nil {
		log.Fatalf("could not close asynq client: %v", err)
	}
}

type Job struct {
	Type string
	Data any
}

func (t *TasksService) CreateAndEnqueue(job Job, opts ...asynq.Option) (*asynq.TaskInfo, error) {
	serialized, err := json.Marshal(job.Data)

	if err != nil {
		return nil, err
	}

	newTask := asynq.NewTask(job.Type, serialized)

	return t.client.Enqueue(newTask, opts...)
}

func parse[T any](serialized []byte) (*T, error) {
	var p T

	err := json.Unmarshal(serialized, &p)

	if err != nil {
		return nil, err
	}

	return &p, nil
}
