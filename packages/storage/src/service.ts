import { ConfigService, type TConfigService } from '@wanderlust/config';
import { DriveManager } from 'flydrive';
import { inject, injectable } from 'inversify';
import { createDriverFactory } from './helpers';

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
	const factory = createDriverFactory(cfg);

	return new DriveManager({
		default: 'default',
		services: {
			default: () => factory.createDriver('default'),
			'profile-images': () => factory.createDriver('profile-images'),
			'banner-images': () => factory.createDriver('banner-images'),
			reviews: () => factory.createDriver('reviews'),
		},
	});
}

export type TStorageService = ReturnType<typeof init>;
