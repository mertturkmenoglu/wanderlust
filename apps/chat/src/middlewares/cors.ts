import type { TConfigService } from '@wanderlust/config';
import { cors } from 'hono/cors';

export function getCorsConfig(cfg: TConfigService) {
	return cors({
		origin: cfg.chat.cors.allowedOrigins,
		allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});
}
