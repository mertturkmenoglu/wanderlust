// Package swaggerdocs Code generated by swaggo/swag. DO NOT EDIT
package swaggerdocs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "termsOfService": "http://localhost:3000/terms",
        "contact": {
            "name": "Mert Turkmenoglu",
            "url": "https://mertturkmenoglu.com",
            "email": "getwanderlust@gmail.com"
        },
        "license": {
            "name": "MIT",
            "url": "https://mit-license.org/"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/auth/credentials/login": {
            "post": {
                "description": "Logs in the user with email and password",
                "consumes": [
                    "application/json"
                ],
                "tags": [
                    "Auth"
                ],
                "summary": "Login with email and password",
                "parameters": [
                    {
                        "description": "Request body",
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/AuthLoginRequestDto"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "400": {
                        "description": "Invalid email or password",
                        "schema": {
                            "$ref": "#/definitions/ErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/ErrorResponse"
                        }
                    }
                }
            }
        },
        "/auth/credentials/register": {
            "post": {
                "description": "Registers a new user with email and password",
                "consumes": [
                    "application/json"
                ],
                "tags": [
                    "Auth"
                ],
                "summary": "Register with email and password",
                "parameters": [
                    {
                        "description": "Request body",
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/AuthRegisterRequestDto"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Created"
                    },
                    "400": {
                        "description": "Invalid email or username",
                        "schema": {
                            "$ref": "#/definitions/ErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/ErrorResponse"
                        }
                    }
                }
            }
        },
        "/auth/forgot-password/reset": {
            "post": {
                "description": "Resets the password of the user",
                "consumes": [
                    "application/json"
                ],
                "tags": [
                    "Auth"
                ],
                "summary": "Reset password",
                "parameters": [
                    {
                        "description": "Request body",
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/AuthResetPasswordRequestDto"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "400": {
                        "description": "Invalid email or code",
                        "schema": {
                            "$ref": "#/definitions/echo.HTTPError"
                        }
                    },
                    "404": {
                        "description": "User not found",
                        "schema": {
                            "$ref": "#/definitions/echo.HTTPError"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/echo.HTTPError"
                        }
                    }
                }
            }
        },
        "/auth/forgot-password/send": {
            "post": {
                "description": "Sends a forgot password email to the user",
                "consumes": [
                    "application/json"
                ],
                "tags": [
                    "Auth"
                ],
                "summary": "Send forgot password email",
                "parameters": [
                    {
                        "description": "Request body",
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/AuthSendForgotPasswordEmailRequestDto"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "400": {
                        "description": "Invalid email",
                        "schema": {
                            "$ref": "#/definitions/echo.HTTPError"
                        }
                    },
                    "404": {
                        "description": "User not found",
                        "schema": {
                            "$ref": "#/definitions/echo.HTTPError"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/echo.HTTPError"
                        }
                    }
                }
            }
        },
        "/auth/logout": {
            "post": {
                "description": "Logs out the current user",
                "consumes": [
                    "application/json"
                ],
                "tags": [
                    "Auth"
                ],
                "summary": "Logs out the current user",
                "responses": {
                    "204": {
                        "description": "No Content"
                    },
                    "401": {
                        "description": "Unauthorized",
                        "schema": {
                            "$ref": "#/definitions/ErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/ErrorResponse"
                        }
                    }
                }
            }
        },
        "/auth/me": {
            "get": {
                "description": "Gets the currently authenticated user or returns an error",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Auth"
                ],
                "summary": "Gets the current user",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/api.Response"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "data": {
                                            "$ref": "#/definitions/AuthGetMeResponseDto"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "401": {
                        "description": "Unauthorized",
                        "schema": {
                            "$ref": "#/definitions/ErrorResponse"
                        }
                    }
                }
            }
        },
        "/auth/verify-email/send": {
            "post": {
                "description": "Sends a verification email to the user",
                "consumes": [
                    "application/json"
                ],
                "tags": [
                    "Auth"
                ],
                "summary": "Send verification email",
                "parameters": [
                    {
                        "description": "Request body",
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/AuthSendVerificationEmailRequestDto"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "400": {
                        "description": "Invalid email or email already verified",
                        "schema": {
                            "$ref": "#/definitions/echo.HTTPError"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/echo.HTTPError"
                        }
                    }
                }
            }
        },
        "/auth/verify-email/verify": {
            "get": {
                "description": "Verifies the email of the user",
                "consumes": [
                    "application/json"
                ],
                "tags": [
                    "Auth"
                ],
                "summary": "Verify email",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Verification code",
                        "name": "code",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "400": {
                        "description": "Invalid or expired verification code",
                        "schema": {
                            "$ref": "#/definitions/echo.HTTPError"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/echo.HTTPError"
                        }
                    }
                }
            }
        },
        "/auth/{provider}": {
            "get": {
                "description": "Logs in the user with Google or Facebook OAuth",
                "tags": [
                    "Auth"
                ],
                "summary": "Login with an OAuth provider",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Provider",
                        "name": "provider",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "307": {
                        "description": "Temporary Redirect"
                    },
                    "400": {
                        "description": "Invalid provider",
                        "schema": {
                            "$ref": "#/definitions/ErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/ErrorResponse"
                        }
                    }
                }
            }
        },
        "/auth/{provider}/callback": {
            "get": {
                "description": "OAuth callback for Google or Facebook",
                "tags": [
                    "Auth"
                ],
                "summary": "OAuth callback",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Provider",
                        "name": "provider",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "307": {
                        "description": "Temporary Redirect"
                    },
                    "400": {
                        "description": "Invalid provider",
                        "schema": {
                            "$ref": "#/definitions/ErrorResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/ErrorResponse"
                        }
                    }
                }
            }
        },
        "/health/": {
            "get": {
                "description": "An endpoint to be used by load balancers to check the health of the service.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Health"
                ],
                "summary": "Health Check",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/HealthGetHealthResponseDto"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "AuthGetMeResponseDto": {
            "description": "Get me response dto",
            "type": "object",
            "required": [
                "createdAt",
                "email",
                "fullName",
                "id",
                "isActive",
                "isEmailVerified",
                "lastLogin",
                "role",
                "updatedAt",
                "username"
            ],
            "properties": {
                "createdAt": {
                    "type": "string",
                    "format": "date-time",
                    "example": "2024-08-26T10:24:13.508676+03:00"
                },
                "email": {
                    "type": "string",
                    "example": "johndoe@example.com"
                },
                "facebookId": {
                    "type": "string",
                    "example": "2391004269112809"
                },
                "fullName": {
                    "type": "string",
                    "example": "John Doe"
                },
                "gender": {
                    "type": "string",
                    "example": "male"
                },
                "googleId": {
                    "type": "string",
                    "example": "10887502189381205719451"
                },
                "id": {
                    "type": "string",
                    "example": "528696135489945615"
                },
                "isActive": {
                    "type": "boolean",
                    "example": true
                },
                "isEmailVerified": {
                    "type": "boolean",
                    "example": true
                },
                "lastLogin": {
                    "type": "string",
                    "example": "2024-08-26T10:24:13.508676+03:00"
                },
                "profileImage": {
                    "type": "string",
                    "example": "https://example.com/image.jpg"
                },
                "role": {
                    "type": "string",
                    "example": "user"
                },
                "updatedAt": {
                    "type": "string",
                    "format": "date-time",
                    "example": "2024-08-26T10:24:13.508676+03:00"
                },
                "username": {
                    "type": "string",
                    "example": "johndoe"
                }
            }
        },
        "AuthLoginRequestDto": {
            "description": "Login request dto",
            "type": "object",
            "required": [
                "email",
                "password"
            ],
            "properties": {
                "email": {
                    "type": "string",
                    "example": "johndoe@example.com"
                },
                "password": {
                    "type": "string",
                    "format": "password",
                    "maxLength": 128,
                    "minLength": 6,
                    "example": "password123"
                }
            }
        },
        "AuthRegisterRequestDto": {
            "description": "Register request dto",
            "type": "object",
            "required": [
                "email",
                "fullName",
                "password",
                "username"
            ],
            "properties": {
                "email": {
                    "type": "string",
                    "maxLength": 128,
                    "minLength": 3,
                    "example": "johndoe@example.com"
                },
                "fullName": {
                    "type": "string",
                    "maxLength": 128,
                    "minLength": 3,
                    "example": "John Doe"
                },
                "password": {
                    "type": "string",
                    "format": "password",
                    "maxLength": 128,
                    "minLength": 6,
                    "example": "password123"
                },
                "username": {
                    "type": "string",
                    "maxLength": 32,
                    "minLength": 4,
                    "example": "johndoe"
                }
            }
        },
        "AuthResetPasswordRequestDto": {
            "description": "Reset password request dto",
            "type": "object",
            "required": [
                "code",
                "email",
                "newPassword"
            ],
            "properties": {
                "code": {
                    "type": "string",
                    "example": "123456"
                },
                "email": {
                    "type": "string",
                    "example": "johndoe@example.com"
                },
                "newPassword": {
                    "type": "string",
                    "format": "password",
                    "maxLength": 128,
                    "minLength": 6,
                    "example": "password123"
                }
            }
        },
        "AuthSendForgotPasswordEmailRequestDto": {
            "description": "Send forgot password email request dto",
            "type": "object",
            "required": [
                "email"
            ],
            "properties": {
                "email": {
                    "type": "string",
                    "example": "johndoe@example.com"
                }
            }
        },
        "AuthSendVerificationEmailRequestDto": {
            "description": "Send verification email request dto",
            "type": "object",
            "required": [
                "email"
            ],
            "properties": {
                "email": {
                    "type": "string",
                    "example": "johndoe@example.com"
                }
            }
        },
        "ErrorResponse": {
            "description": "Error response",
            "type": "object",
            "properties": {
                "errors": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/api.ErrorDto"
                    }
                }
            }
        },
        "HealthGetHealthResponseDto": {
            "description": "GetHealthResponseDto",
            "type": "object",
            "required": [
                "message"
            ],
            "properties": {
                "message": {
                    "type": "string"
                }
            }
        },
        "api.ErrorDto": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "string"
                },
                "detail": {
                    "type": "string"
                },
                "status": {
                    "type": "string"
                },
                "title": {
                    "type": "string"
                }
            }
        },
        "api.Response": {
            "description": "Response",
            "type": "object",
            "properties": {
                "data": {}
            }
        },
        "echo.HTTPError": {
            "type": "object",
            "properties": {
                "message": {}
            }
        }
    },
    "securityDefinitions": {
        "CookieAuth": {
            "description": "Cookie based session authentication",
            "type": "apiKey",
            "name": "__wanderlust_auth",
            "in": "cookie"
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:5000",
	BasePath:         "/api",
	Schemes:          []string{},
	Title:            "Wanderlust API",
	Description:      "Wanderlust backend services",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
