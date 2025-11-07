package tasks

import (
	"encoding/json"
	"log"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/db"
	"wanderlust/pkg/logs"
	"wanderlust/pkg/mail"

	"github.com/hibiken/asynq"
	"github.com/pterm/pterm"
)

type TasksService struct {
	client    *asynq.Client
	scheduler *asynq.Scheduler
	mailSvc   *mail.MailService
	cache     *cache.Cache
	db        *db.Db
	addr      string
	logger    *pterm.Logger
}

func New(mailSvc *mail.MailService, db *db.Db, cacheSvc *cache.Cache) *TasksService {
	return &TasksService{
		client: asynq.NewClient(asynq.RedisClientOpt{
			Addr: cfg.Env.RedisAddr,
		}),
		scheduler: asynq.NewScheduler(asynq.RedisClientOpt{
			Addr: cfg.Env.RedisAddr,
		}, nil),
		mailSvc: mailSvc,
		addr:    cfg.Env.RedisAddr,
		db:      db,
		cache:   cacheSvc,
		logger:  logs.NewPTermLogger(),
	}
}

func (t *TasksService) NewMux() *asynq.ServeMux {
	mux := asynq.NewServeMux()

	mux.HandleFunc(TypeForgotPasswordEmail, t.HandleEmailForgotPasswordTask)
	mux.HandleFunc(TypeNewLoginAlertEmail, t.HandleNewLoginAlertEmailTask)
	mux.HandleFunc(TypeWelcomeEmail, t.HandleWelcomeEmailTask)
	mux.HandleFunc(TypePasswordResetEmail, t.HandlePasswordResetEmailTask)
	mux.HandleFunc(TypeVerifyEmailEmail, t.HandleVerifyEmailEmailTask)
	mux.HandleFunc(TypeFindExpiredTripInvites, t.FindExpiredTripInvitesTask)
	mux.HandleFunc(TypeDeleteExpiredTripInvite, t.DeleteExpiredTripInviteTask)

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

func (t *TasksService) RunScheduler() {
	if err := t.scheduler.Run(); err != nil {
		log.Fatalf("could not run asynq scheduler: %v", err)
	}
}

func (t *TasksService) Close() {
	log.Println("Closing asynq client")
	err := t.client.Close()

	if err != nil {
		log.Fatalf("could not close asynq client: %v", err)
	}

	t.scheduler.Shutdown()
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

func (t *TasksService) Schedule(cronspec string, task *asynq.Task, opts ...asynq.Option) (string, error) {
	return t.scheduler.Register(cronspec, task, opts...)
}

func parse[T any](serialized []byte) (*T, error) {
	var p T

	err := json.Unmarshal(serialized, &p)

	if err != nil {
		return nil, err
	}

	return &p, nil
}
