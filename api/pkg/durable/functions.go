package durable

import (
	"context"
	"fmt"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

func testFn(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "test-fn",
		},
		inngestgo.EventTrigger("shop/product.imported", nil),
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			res, err := step.Run(ctx, "step1", func(ctx context.Context) ([]string, error) {
				return []string{"test1", "test2"}, nil
			})

			if err != nil {
				return nil, err
			}

			_, err = step.Run(ctx, "step2", func(ctx context.Context) (any, error) {
				fmt.Println(res)
				return nil, nil
			})

			if err != nil {
				return nil, err
			}

			return nil, nil
		},
	)
}

func sendForgotPasswordEmail(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID:   "send-forgot-password-email",
			Name: "Send Forgot Password Email",
		},
		inngestgo.EventTrigger(EventSendForgotPasswordEmail, nil),
		func(ctx context.Context, input inngestgo.Input[SendForgotPasswordEmailPayload]) (any, error) {
			return step.Run(ctx, "step-send-forgot-password-email", func(ctx context.Context) (any, error) {
				// Implement the email sending logic here
				return nil, nil
			})
		},
	)
}

var functions = []func(client inngestgo.Client) (inngestgo.ServableFunction, error){
	testFn,
	sendForgotPasswordEmail,
}
