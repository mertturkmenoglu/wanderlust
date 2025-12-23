/** biome-ignore-all lint/complexity/noStaticOnlyClass: We don't need this rule */
import { z } from 'zod';
import { Container } from '../di';
import { ConfigFileValidationError } from './errors';
import { schema } from './schema';

export class ConfigProvider {
	static async createInstance(_ioc: Container) {
		return await init();
	}

	static get id() {
		return Container.createIdentifier<TConfig>('config');
	}
}

async function init(): Promise<TConfig> {
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

export type TConfig = z.infer<typeof schema>;
