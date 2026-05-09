import { inject, injectable } from 'inversify';
import nodemailer from 'nodemailer';
import { ConfigService, type TConfigService } from '../config';

@injectable()
export class EmailService {
	private readonly instance: TEmailService;

	constructor(@inject(ConfigService) private readonly cfg: ConfigService) {
		this.instance = init(this.cfg.get());
	}

	get(): TEmailService {
		return this.instance;
	}
}

function init(cfg: TConfigService) {
	return nodemailer.createTransport({
		host: cfg.email.host,
		port: cfg.email.port,
		secure: cfg.email.ssl,
	});
}

export type TEmailService = ReturnType<typeof init>;
