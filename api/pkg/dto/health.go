package dto

type HealthInput struct{}

type HealthOutput struct {
	Body HealthOutputBody
}

type HealthOutputBody struct {
	Message string `json:"message" example:"OK" doc:"Health message of the API"`
}
