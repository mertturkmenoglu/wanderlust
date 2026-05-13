import { configSchema, TaggedError } from '@wanderlust/common';
import { injectable } from 'inversify';
import { z } from 'zod';

export class ConfigFileValidationError extends TaggedError(
	'ConfigFileValidationError',
) { }

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
		const data = await Bun.file('../../../api/config.toml').text();

		const obj = Bun.TOML.parse(data);

		const res = configSchema.safeParse(obj);

		if (!res.success) {
			throw new ConfigFileValidationError('Config file parse validation failed', {
				cause: z.treeifyError(res.error),
			});
		}

		return res.data;
	}
}

export type TConfigService = z.infer<typeof configSchema>;
