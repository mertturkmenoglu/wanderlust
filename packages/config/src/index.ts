import { injectable } from 'inversify';
import { z } from 'zod';
import configJson from '../../../config.json' with { type: 'json' };
import { configSchema } from './config-schema';

@injectable()
export class ConfigService {
	private readonly instance: TConfigService;

	constructor() {
		this.instance = init();
	}

	get(): TConfigService {
		return this.instance;
	}
}

function init() {
	const res = configSchema.safeParse(configJson);

	if (!res.success) {
		throw new Error('Config file parse validation failed', {
			cause: z.treeifyError(res.error),
		});
	}

	return res.data;
}

export type TConfigService = ReturnType<typeof init>;
