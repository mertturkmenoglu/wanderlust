package auth

import (
	"wanderlust/internal/pkg/middlewares"

	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/auth")
	{
		routes.POST(
			"/verify-email/send",
			m.handlers.SendVerificationEmail,
			middlewares.ParseBody[SendVerificationEmailRequestDto],
		)
		routes.GET("/verify-email/verify", m.handlers.VerifyEmail)
		routes.POST(
			"/forgot-password/send",
			m.handlers.SendForgotPasswordEmail,
			middlewares.ParseBody[SendForgotPasswordEmailRequestDto],
		)
		routes.POST("/forgot-password/reset", m.handlers.ResetPassword, middlewares.ParseBody[ResetPasswordRequestDto])
	}
}
