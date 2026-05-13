import z from 'zod';

export const configSchema = z.object({
	api: z.object({
		port: z.number(),
		url: z.string(),
	}),
	cache: z.object({
		grace: z.string(),
		graceBackoff: z.string(),
		l1MaxSize: z.string(),
	}),
	cors: z.object({
		allowedOrigins: z.array(z.string()),
	}),
	database: z.object({
		url: z.string(),
		ssl: z.boolean(),
	}),
	email: z.object({
		from: z.string(),
		host: z.string(),
		port: z.number(),
		ssl: z.boolean(),
	}),
	redis: z.object({
		host: z.string(),
		port: z.number(),
		db: z.number(),
	}),
	typesense: z.object({
		port: z.number(),
		apiKey: z.string(),
		dashboardPort: z.number(),
		url: z.string(),
	}),
	web: z.object({
		url: z.string(),
	}),
});
