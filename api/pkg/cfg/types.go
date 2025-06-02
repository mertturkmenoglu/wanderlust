package cfg

type TEnv struct {
	AccessTokenSecret        string `key:"ACCESS_TOKEN_SECRET"`
	AsynqmonPort             int    `key:"ASYNQMON_PORT"`
	DBHost                   string `key:"DB_HOST"`
	DBName                   string `key:"DB_NAME"`
	DBPassword               string `key:"DB_PASSWORD"`
	DBPort                   int    `key:"DB_PORT"`
	DBTimezone               string `key:"DB_TIMEZONE"`
	DBUser                   string `key:"DB_USER"`
	Debug                    bool   `key:"DEBUG"`
	DocsType                 string `key:"DOCS_TYPE"`
	EmailFrom                string `key:"EMAIL_FROM"`
	EmailName                string `key:"EMAIL_NAME"`
	Env                      string `key:"ENV"`
	FacebookCallback         string `key:"FACEBOOK_CALLBACK"`
	FacebookClientID         string `key:"FACEBOOK_CLIENT_ID"`
	FacebookClientSecret     string `key:"FACEBOOK_CLIENT_SECRET"`
	GoogleCallback           string `key:"GOOGLE_CALLBACK"`
	GoogleClientID           string `key:"GOOGLE_CLIENT_ID"`
	GoogleClientSecret       string `key:"GOOGLE_CLIENT_SECRET"`
	GooseDriver              string `key:"GOOSE_DRIVER"`
	GooseDBString            string `key:"GOOSE_DBSTRING"`
	GooseMigrationDir        string `key:"GOOSE_MIGRATION_DIR"`
	GrafanaPort              int    `key:"GRAFANA_PORT"`
	LoggerType               string `key:"LOGGER_TYPE"`
	MailpitPort              int    `key:"MAILPIT_PORT"`
	MailpitSMTPPort          int    `key:"MAILPIT_SMTP_PORT"`
	MinioAutocreateBuckets   bool   `key:"MINIO_AUTOCREATE_BUCKETS"`
	MinioConsolePort         int    `key:"MINIO_CONSOLE_PORT"`
	MinioEndpoint            string `key:"MINIO_ENDPOINT"`
	MinioLocation            string `key:"MINIO_LOCATION"`
	MinioPort                int    `key:"MINIO_PORT"`
	MinioPassword            string `key:"MINIO_PASSWORD"`
	MinioUser                string `key:"MINIO_USER"`
	OAuthRedirect            string `key:"OAUTH_REDIRECT"`
	OLGTMGRPCPort            int    `key:"OLGTM_GRPC_PORT"`
	OLGTMHTTPPort            int    `key:"OLGTM_HTTP_PORT"`
	OTLPAuthToken            string `key:"OTLP_AUTH_TOKEN"`
	OTLPEndpoint             string `key:"OTLP_ENDPOINT"`
	OTLPLogsUrlPath          string `key:"OTLP_LOGS_URL_PATH"`
	OTLPMetricsUrlPath       string `key:"OTLP_METRICS_URL_PATH"`
	OTLPTracesUrlPath        string `key:"OTLP_TRACES_URL_PATH"`
	OTLPWriterEndpoint       string `key:"OTLP_WRITER_ENDPOINT"`
	Port                     int    `key:"PORT"`
	RedisAddr                string `key:"REDIS_ADDR"`
	RedisPort                int    `key:"REDIS_PORT"`
	RedisURL                 string `key:"REDIS_URL"`
	RefreshTokenSecret       string `key:"REFRESH_TOKEN_SECRET"`
	SessionMaxAge            int    `key:"SESSION_MAX_AGE"`
	SessionPath              string `key:"SESSION_PATH"`
	SignKey                  string `key:"SIGN_KEY"`
	SMTPAddr                 string `key:"SMTP_ADDR"`
	SMTPHost                 string `key:"SMTP_HOST"`
	SMTPIdentity             string `key:"SMTP_IDENTITY"`
	SMTPPassword             string `key:"SMTP_PASSWORD"`
	SMTPUsername             string `key:"SMTP_USERNAME"`
	TypesensePort            int    `key:"TYPESENSE_PORT"`
	TypesenseAPIKey          string `key:"TYPESENSE_API_KEY"`
	TypesenseDashboardPort   int    `key:"TYPESENSE_DASHBOARD_PORT"`
	TypesenseUrl             string `key:"TYPESENSE_URL"`
	UploadPresignedURLExpMin int    `key:"UPLOAD_PRESIGNED_URL_EXP_MIN"`
	URL                      string `key:"URL"`
	WebURL                   string `key:"WEB_URL"`
}

var Env = TEnv{}
