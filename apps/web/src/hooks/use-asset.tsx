import type { Outputs } from '@/lib/orpc';

type Asset = Outputs['places']['get']['place']['assets'][number];

export function useAsset(assets: Asset[]): Asset {
	return (
		assets[0] ?? {
			id: 0,
			url: '/logo.png',
			description: '',
			entityId: '',
			entityType: 'place',
			order: 1,
			createdAt: new Date(),
			updatedAt: new Date(),
		}
	);
}
