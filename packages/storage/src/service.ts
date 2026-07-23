import type { ConfigService } from '@wanderlust/config';
import { DriveManager } from 'flydrive';
import { createDriverFactory } from './helpers';

export function createStorage(deps: { cfg: ConfigService }) {
	const factory = createDriverFactory(deps.cfg);

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

export type StorageService = ReturnType<typeof createStorage>;
