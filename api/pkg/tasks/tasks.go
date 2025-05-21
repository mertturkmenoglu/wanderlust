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
	Client  *asynq.Client
	mailSvc *mail.MailService
	upload  *upload.UploadService
	addr    string
}

func New(mailSvc *mail.MailService, upload *upload.UploadService) *TasksService {
	return &TasksService{
		Client: asynq.NewClient(asynq.RedisClientOpt{
			Addr: cfg.Env.RedisAddr,
		}),
		mailSvc: mailSvc,
		upload:  upload,
		addr:    cfg.Env.RedisAddr,
	}
}

func (t *TasksService) Run() {
	srv := asynq.NewServer(
		asynq.RedisClientOpt{
			Addr: t.addr,
		},
		asynq.Config{
			Concurrency: 10,
		},
	)

	mux := asynq.NewServeMux()

	t.register(mux)

	if err := srv.Run(mux); err != nil {
		log.Fatalf("could not run asynq server: %v", err)
	}
}

func (t *TasksService) Close() {
	log.Println("Closing asynq client")
	err := t.Client.Close()

	if err != nil {
		log.Fatalf("could not close asynq client: %v", err)
	}
}

func (t *TasksService) CreateAndEnqueue(taskType string, payload any, opts ...asynq.Option) (*asynq.TaskInfo, error) {
	serialized, err := json.Marshal(payload)

	if err != nil {
		return nil, err
	}

	newTask := asynq.NewTask(taskType, serialized)

	return t.Client.Enqueue(newTask, opts...)
}
