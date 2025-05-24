package cfg

type TEnv struct {
	FacebookCallback         string `key:"FACEBOOK_CALLBACK"`
	GoogleCallback           string `key:"GOOGLE_CALLBACK"`
	OauthRedirect            string `key:"OAUTH_REDIRECT"`
	SessionMaxAge            int    `key:"SESSION_MAX_AGE"`
	SessionPath              string `key:"SESSION_PATH"`
	SignKey                  string `key:"SIGN_KEY"`
	DocsType                 string `key:"DOCS_TYPE"`
	LoggerType               string `key:"LOGGER_TYPE"`
	SearchAPIKey             string `key:"SEARCH_API_KEY"`
	SearchServerURL          string `key:"SEARCH_SERVER_URL"`
	UploadPresignedURLExpMin int    `key:"UPLOAD_PRESIGNED_URL_EXP_MIN"`
	URL                      string `key:"URL"`
	DBHost                   string `key:"DB_HOST"`
	DBName                   string `key:"DB_NAME"`
	DBPassword               string `key:"DB_PASSWORD"`
	DBPort                   int    `key:"DB_PORT"`
	DBTimezone               string `key:"DB_TIMEZONE"`
	DBUser                   string `key:"DB_USER"`
	Debug                    bool   `key:"DEBUG"`
	EmailFrom                string `key:"EMAIL_FROM"`
	EmailName                string `key:"EMAIL_NAME"`
	Env                      string `key:"ENV"`
	FacebookClientID         string `key:"FACEBOOK_CLIENT_ID"`
	FacebookClientSecret     string `key:"FACEBOOK_CLIENT_SECRET"`
	GoogleClientID           string `key:"GOOGLE_CLIENT_ID"`
	GoogleClientSecret       string `key:"GOOGLE_CLIENT_SECRET"`
	JWTSecret                string `key:"JWT_SECRET"`
	MinioAutocreateBuckets   bool   `key:"MINIO_AUTOCREATE_BUCKETS"`
	MinioEndpoint            string `key:"MINIO_ENDPOINT"`
	MinioLocation            string `key:"MINIO_LOCATION"`
	MinioPassword            string `key:"MINIO_PASSWORD"`
	MinioUser                string `key:"MINIO_USER"`
	OtlpEndpoint             string `key:"OTLP_ENDPOINT"`
	OtlpWriterEndpoint       string `key:"OTLP_WRITER_ENDPOINT"`
	OtlpLogsURLPath          string `key:"OTLP_LOGS_URL_PATH"`
	OtlpTraceURLPath         string `key:"OTLP_TRACE_URL_PATH"`
	OtlpMetricsURLPath       string `key:"OTLP_METRICS_URL_PATH"`
	OtlpAuthToken            string `key:"OTLP_AUTH_TOKEN"`
	Port                     int    `key:"PORT"`
	RedisAddr                string `key:"REDIS_ADDR"`
	RedisURL                 string `key:"REDIS_URL"`
	RunMigrations            string `key:"RUN_MIGRATIONS"`
	SMTPAddr                 string `key:"SMTP_ADDR"`
	SMTPHost                 string `key:"SMTP_HOST"`
	SMTPIdentity             string `key:"SMTP_IDENTITY"`
	SMTPPassword             string `key:"SMTP_PASSWORD"`
	SMTPUsername             string `key:"SMTP_USERNAME"`
	WebURL                   string `key:"WEB_URL"`
}

var Env = TEnv{}
