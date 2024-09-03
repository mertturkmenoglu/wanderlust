package tasks

import (
	"encoding/json"
	"log"
	"wanderlust/config"
	"wanderlust/internal/email"

	"github.com/hibiken/asynq"
	"github.com/spf13/viper"
)

type Tasks struct {
	Client *asynq.Client
	email  *email.EmailService
}

func New(emailService *email.EmailService) *Tasks {
	addr := viper.GetString(config.REDIS_ADDR)
	client := asynq.NewClient(asynq.RedisClientOpt{
		Addr: addr,
	})

	return &Tasks{
		Client: client,
		email:  emailService,
	}
}

func (t *Tasks) Run() {
	addr := viper.GetString(config.REDIS_ADDR)
	srv := asynq.NewServer(
		asynq.RedisClientOpt{Addr: addr},
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
