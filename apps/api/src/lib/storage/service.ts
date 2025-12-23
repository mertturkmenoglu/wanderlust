import { Disk } from 'flydrive';
import { FSDriver } from 'flydrive/drivers/fs';
import type { SignedURLOptions } from 'flydrive/types';
import { ConfigProvider, type TConfig } from '../config';
import { Container, type IServiceProvider } from '../di';

export class StorageProvider implements IServiceProvider<TStorageService> {
	private readonly instance: TStorageService;

	constructor(ioc: Container) {
		const cfg = ioc.resolve(ConfigProvider.id);
		this.instance = init(cfg);
	}

	get(): TStorageService {
		return this.instance;
	}

	static get id() {
		return Container.createIdentifier<TStorageService>('storage');
	}
}

function init(cfg: TConfig) {
	const fsDriver = new FSDriver({
		location: new URL('../../../uploads', import.meta.url),
		visibility: 'public',
		urlBuilder: {
			async generateURL(key: string, _filePath: string) {
				return `${cfg.api.url}/uploads/${key}`;
			},

			async generateSignedURL(
				key: string,
				_filePath: string,
				_options: SignedURLOptions,
			) {
				/**
				 * It is up to your application to decide how to create and verify
				 * signed URLs. Do note this method can be async.
				 */
				return `${cfg.api.url}/uploads/${key}`;
			},
		},
	});

	return new Disk(fsDriver);
}

export type TStorageService = ReturnType<typeof init>;
