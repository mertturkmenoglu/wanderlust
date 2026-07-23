import type { ConfigService } from '@wanderlust/config';
import { cors } from 'hono/cors';

export function getCorsConfig(cfg: ConfigService) {
	return cors({
		origin: cfg.api.cors.allowedOrigins,
		allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});
}
