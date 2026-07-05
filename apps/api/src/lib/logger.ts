import winston from 'winston';

const { combine, timestamp, printf, colorize, json, align } = winston.format;

const devFormat = combine(
	colorize(),
	timestamp(),
	printf(({ level, message, timestamp, ...meta }) => {
		const rest = Object.keys(meta).length ? JSON.stringify(meta) : '';
		return `${timestamp} [${level}] ${message} ${rest}`;
	}),
);

export const logger = winston.createLogger({
	level: 'info',
	format:
		process.env.NODE_ENV === 'production'
			? combine(timestamp(), json())
			: devFormat,
	defaultMeta: { service: 'wl-api' },
	transports: [new winston.transports.Console()],
});

export const requestLogger = winston.createLogger({
	level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
	format: combine(
		colorize({ all: true }),
		timestamp({ format: 'HH:mm:ss' }),
		align(),
		printf(
			({ level, message, timestamp, ...meta }) => {
				const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
				return `[${timestamp}] ${level}: ${message}${metaStr}`;
			}
		),
	),
	transports: [new winston.transports.Console()],
});
