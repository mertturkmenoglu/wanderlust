import type { ConfigService } from '@wanderlust/config';
import nodemailer from 'nodemailer';

export function createEmail(deps: { cfg: ConfigService }) {
	return nodemailer.createTransport({
		host: deps.cfg.email.host,
		port: deps.cfg.email.port,
		secure: deps.cfg.email.ssl,
	});
}

export type EmailService = ReturnType<typeof createEmail>;
