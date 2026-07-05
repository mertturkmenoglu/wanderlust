import winston from 'winston';

const { combine, timestamp, printf, colorize, json } = winston.format;

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
