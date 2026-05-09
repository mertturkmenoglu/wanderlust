import { injectable } from 'inversify';
import { z } from 'zod';
import { ConfigFileValidationError } from './errors';
import { schema } from './schema';

@injectable()
export class ConfigService {
	private instance!: TConfigService;

	get(): TConfigService {
		return this.instance;
	}

	set(config: TConfigService) {
		this.instance = config;
	}

	static async init() {
		const data = await Bun.file('./config.toml').text();

		const obj = Bun.TOML.parse(data);

		const res = schema.safeParse(obj);

		if (!res.success) {
			throw new ConfigFileValidationError('', {
				cause: z.treeifyError(res.error),
			});
		}

		return res.data;
	}
}

export type TConfigService = z.infer<typeof schema>;
