import nodemailer from 'nodemailer';
import { ConfigProvider, type TConfig } from '../config';
import { Container, type IServiceProvider } from '../di';

export class EmailProvider implements IServiceProvider<TEmailService> {
	private readonly instance: TEmailService;

	constructor(ioc: Container) {
		const cfg = ioc.resolve(ConfigProvider.id);
		this.instance = init(cfg);
	}

	get(): TEmailService {
		return this.instance;
	}

	static get id() {
		return Container.createIdentifier<TEmailService>('email');
	}
}

function init(cfg: TConfig) {
	return nodemailer.createTransport({
		host: cfg.email.host,
		port: cfg.email.port,
		secure: cfg.email.ssl,
	});
}

export type TEmailService = ReturnType<typeof init>;
