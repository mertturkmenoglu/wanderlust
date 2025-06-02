package core

import (
	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humaecho"
	"github.com/labstack/echo/v4"
)

func NewHumaApi(e *echo.Echo) *huma.API {
	hc := GetHumaConfig()
	api := humaecho.New(e, *hc)
	SetupOpenApiDocs(&api)
	return &api
}

func SetupOpenApiSecurityConfig(hc *huma.Config) {
	hc.Components.SecuritySchemes = map[string]*huma.SecurityScheme{
		"BearerJWT": {
			Type:         "http",
			Scheme:       "bearer",
			BearerFormat: "JWT",
		},
	}
}

func SetupOpenApiDocs(api *huma.API) {
	(*api).OpenAPI().Info = &huma.Info{
		Title:       API_NAME,
		Description: API_DESCRIPTION,
		Version:     API_VERSION,
	}
}

func GetHumaConfig() *huma.Config {
	humaConfig := huma.DefaultConfig(API_NAME, API_VERSION)
	SetupOpenApiSecurityConfig(&humaConfig)
	return &humaConfig
}
