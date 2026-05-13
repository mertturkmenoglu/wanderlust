import { ConfigService, type TConfigService } from '@wanderlust/config';
import { Disk } from 'flydrive';
import { FSDriver } from 'flydrive/drivers/fs';
import type { SignedURLOptions } from 'flydrive/types';
import { inject, injectable } from 'inversify';

@injectable()
export class StorageService {
	private readonly instance: TStorageService;

	constructor(@inject(ConfigService) private readonly cfg: ConfigService) {
		this.instance = init(this.cfg.get());
	}

	get(): TStorageService {
		return this.instance;
	}
}

function init(cfg: TConfigService) {
	const fsDriver = new FSDriver({
		location: new URL('uploads/', import.meta.url),
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
