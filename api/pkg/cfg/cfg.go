package cfg

import "github.com/caarlos0/env/v11"

//go:generate envdoc -format dotenv -output ../../.env
type TEnv struct {
	// AccessTokenSecret is the secret used to generate access tokens.
	AccessTokenSecret string `env:"ACCESS_TOKEN_SECRET" envDefault:"wanderlust"`
	// AsynqmonPort is the port for the Asynq web UI.
	AsynqmonPort int `env:"ASYNQMON_PORT" envDefault:"8000"`
	// DBHost is the host for the database.
	DBHost string `env:"DB_HOST" envDefault:"localhost"`
	// DBName is the name of the database.
	DBName string `env:"DB_NAME" envDefault:"wanderlust"`
	// DBPassword is the password for the database.
	DBPassword string `env:"DB_PASSWORD" envDefault:"postgres"`
	// DBPort is the port for the database.
	DBPort int `env:"DB_PORT" envDefault:"5432"`
	// DBTimezone is the timezone for the database. Use UTC if you don't have a strong reason to change it.
	DBTimezone string `env:"DB_TIMEZONE" envDefault:"UTC"`
	// DBUser is the user for the database.
	DBUser string `env:"DB_USER" envDefault:"postgres"`
	// Debug is a boolean flag to enable debug mode.
	Debug bool `env:"DEBUG" envDefault:"false"`
	// DocsType is the type of documentation to use. Valid values are "scalar" and "stoplight".
	DocsType string `env:"DOCS_TYPE" envDefault:"scalar"`
	// EmailFrom is the email address to use as the sender for emails.
	EmailFrom string `env:"EMAIL_FROM" envDefault:"getwanderlust@gmail.com"`
	// EmailName is the name to use as the sender for emails.
	EmailName string `env:"EMAIL_NAME" envDefault:"Wanderlust"`
	// EnableEmails is a boolean flag to enable emails.
	EnableEmails bool `env:"ENABLE_EMAILS" envDefault:"true"`
	// Env is the environment to run the application in. Valid values are "dev" and "prod".
	Env string `env:"ENV" envDefault:"dev"`
	// FacebookCallback is the callback URL for Facebook.
	FacebookCallback string `env:"FACEBOOK_CALLBACK" envDefault:"http://localhost:5000/api/v2/auth/facebook/callback"`
	// FacebookClientID is the client ID for Facebook.
	FacebookClientID string `env:"FACEBOOK_CLIENT_ID,required"`
	// FacebookClientSecret is the client secret for Facebook.
	FacebookClientSecret string `env:"FACEBOOK_CLIENT_SECRET,required"`
	// GoogleCallback is the callback URL for Google.
	GoogleCallback string `env:"GOOGLE_CALLBACK" envDefault:"http://localhost:5000/api/v2/auth/google/callback"`
	// GoogleClientID is the client ID for Google.
	GoogleClientID string `env:"GOOGLE_CLIENT_ID,required"`
	// GoogleClientSecret is the client secret for Google.
	GoogleClientSecret string `env:"GOOGLE_CLIENT_SECRET,required"`
	// GooseDriver is the database driver to use for Goose.
	GooseDriver string `env:"GOOSE_DRIVER" envDefault:"postgres"`
	// GooseDBString is the connection string for Goose.
	GooseDBString string `env:"GOOSE_DBSTRING" envDefault:"postgres://postgres:postgres@localhost:5432/wanderlust"`
	// GooseMigrationDir is the directory where migrations are stored.
	GooseMigrationDir string `env:"GOOSE_MIGRATION_DIR" envDefault:"./pkg/db/migrations"`
	// GrafanaPort is the port for Grafana.
	GrafanaPort int `env:"GRAFANA_PORT" envDefault:"3010"`
	// LoggerType is the type of logger to use. Valid values are "file" and "console".
	LoggerType string `env:"LOGGER_TYPE" envDefault:"file"`
	// MailpitPort is the port for Mailpit.
	MailpitPort int `env:"MAILPIT_PORT" envDefault:"8025"`
	// MailpitSMTPPort is the port for Mailpit SMTP.
	MailpitSMTPPort int `env:"MAILPIT_SMTP_PORT" envDefault:"1025"`
	// MinioAutocreateBuckets is a boolean flag to enable auto-creation of buckets.
	MinioAutocreateBuckets bool `env:"MINIO_AUTOCREATE_BUCKETS" envDefault:"true"`
	// MinioConsolePort is the port for Minio Console.
	MinioConsolePort int `env:"MINIO_CONSOLE_PORT" envDefault:"9001"`
	// MinioEndpoint is the endpoint for Minio.
	MinioEndpoint string `env:"MINIO_ENDPOINT" envDefault:"localhost:9000"`
	// MinioLocation is the location for Minio.
	MinioLocation string `env:"MINIO_LOCATION" envDefault:"eu-central-1"`
	// MinioPort is the port for Minio.
	MinioPort int `env:"MINIO_PORT" envDefault:"9000"`
	// MinioPassword is the password for Minio.
	MinioPassword string `env:"MINIO_PASSWORD" envDefault:"wanderlust"`
	// MinioUser is the user for Minio.
	MinioUser string `env:"MINIO_USER" envDefault:"wanderlust"`
	// OAuthRedirect is the redirect URL for OAuth flow.
	OAuthRedirect string `env:"OAUTH_REDIRECT" envDefault:"http://localhost:3000"`
	// OLGTMGRPCPort is the port for the OLGTM gRPC server.
	OLGTMGRPCPort int `env:"OLGTM_GRPC_PORT" envDefault:"4317"`
	// OLGTMHTTPPort is the port for the OLGTM HTTP server.
	OLGTMHTTPPort int `env:"OLGTM_HTTP_PORT" envDefault:"4318"`
	// OTLPAuthToken is the auth token for the OTLP server.
	OTLPAuthToken string `env:"OTLP_AUTH_TOKEN" envDefault:"change.this.value.at.production.alloy"`
	// OTLPEndpoint is the endpoint for the OTLP server.
	OTLPEndpoint string `env:"OTLP_ENDPOINT" envDefault:"localhost:4318"`
	// OTLPLogsUrlPath is the URL path for the OTLP logs endpoint.
	OTLPLogsUrlPath string `env:"OTLP_LOGS_URL_PATH" envDefault:"/v1/logs"`
	// OTLPMetricsUrlPath is the URL path for the OTLP metrics endpoint.
	OTLPMetricsUrlPath string `env:"OTLP_METRICS_URL_PATH" envDefault:"/v1/metrics"`
	// OTLPTracesUrlPath is the URL path for the OTLP traces endpoint.
	OTLPTracesUrlPath string `env:"OTLP_TRACES_URL_PATH" envDefault:"/v1/traces"`
	// OTLPWriterEndpoint is the endpoint for the OTLP writer.
	OTLPWriterEndpoint string `env:"OTLP_WRITER_ENDPOINT" envDefault:"http://localhost:4318/v1/logs"`
	// Port is the port to run the application on.
	Port int `env:"PORT" envDefault:"5000"`
	// RedisAddr is the address for the Redis server.
	RedisAddr string `env:"REDIS_ADDR" envDefault:"127.0.0.1:6379"`
	// RedisPort is the port for the Redis server.
	RedisPort int `env:"REDIS_PORT" envDefault:"6379"`
	// RedisURL is the URL for the Redis server as seen from another Docker container.
	RedisURL string `env:"REDIS_URL" envDefault:"redis://localhost:6379/0"`
	// RefreshTokenSecret is the secret for refresh tokens.
	RefreshTokenSecret string `env:"REFRESH_TOKEN_SECRET" envDefault:"wanderlust"`
	// SessionMaxAge is the maximum age of a session in seconds.
	SessionMaxAge int `env:"SESSION_MAX_AGE" envDefault:"604800"`
	// SessionPath is the path for sessions.
	SessionPath string `env:"SESSION_PATH" envDefault:"/"`
	// SignKey is the key used to sign cookies.
	SignKey string `env:"SIGN_KEY" envDefault:"wanderlust"`
	// SMTPAddr is the address for SMTP.
	SMTPAddr string `env:"SMTP_ADDR" envDefault:"localhost:1025"`
	// SMTPHost is the host for SMTP.
	SMTPHost string `env:"SMTP_HOST" envDefault:"localhost"`
	// SMTPIdentity is the identity for SMTP.
	SMTPIdentity string `env:"SMTP_IDENTITY" envDefault:"-"`
	// SMTPPassword is the password for SMTP.
	SMTPPassword string `env:"SMTP_PASSWORD" envDefault:"-"`
	// SMTPUsername is the username for SMTP.
	SMTPUsername string `env:"SMTP_USERNAME" envDefault:"-"`
	// TypesensePort is the port for Typesense.
	TypesensePort int `env:"TYPESENSE_PORT" envDefault:"8108"`
	// TypesenseAPIKey is the API key for Typesense.
	TypesenseAPIKey string `env:"TYPESENSE_API_KEY" envDefault:"wanderlust"`
	// TypesenseDashboardPort is the port for Typesense Dashboard.
	TypesenseDashboardPort int `env:"TYPESENSE_DASHBOARD_PORT" envDefault:"3006"`
	// TypesenseUrl is the URL for Typesense.
	TypesenseUrl string `env:"TYPESENSE_URL" envDefault:"http://localhost:8108"`
	// UploadPresignedURLExpMin is the expiration time for upload presigned URLs in minutes.
	UploadPresignedURLExpMin int `env:"UPLOAD_PRESIGNED_URL_EXP_MIN" envDefault:"15"`
	// URL is the URL for the application.
	URL string `env:"URL" envDefault:"http://localhost:5000"`
	// WebURL is the URL for the web application.
	WebURL string `env:"WEB_URL" envDefault:"http://localhost:3000"`
}

var Env = TEnv{}

func Init() {
	err := env.Parse(&Env)

	if err != nil {
		panic(err)
	}
}
