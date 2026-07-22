import type { Assets } from '@wanderlust/contract';
import { DatabaseService, schema, type TDatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { invariant } from '@/lib/invariant';
import { TraceAll } from '@/lib/tracer';

@injectable()
@TraceAll()
export class AssetsRepository {
	private readonly db: TDatabaseService;

	constructor(@inject(DatabaseService) db: DatabaseService) {
		this.db = db.get();
	}

	async create(v: {
		userId: string;
		data: Assets.dto.CreateInput;
		info: Bun.Image.Metadata;
		blurhash: string;
		filename: string;
		url: string;
		size: number;
	}): Promise<Assets.dto.CreateOutput> {
		const [asset] = await this.db
			.insert(schema.assets)
			.values({
				url: v.url,
				bucket: 'reviews',
				key: v.filename,
				mimeType: 'image/webp',
				size: v.size,
				width: v.info.width,
				height: v.info.height,
				blurhash: v.blurhash,
				alt: v.data.asset.alt ?? null,
				status: 'pending',
				visibility: 'public',
				uploadedBy: v.userId,
				metadata: null,
				attributions: v.data.asset.attributions,
			})
			.returning();

		invariant(asset, 'INTERNAL_SERVER_ERROR', 'Failed to create asset');

		return {
			asset: {
				...asset,
				metadata: asset.metadata as Record<string, unknown> | null,
			},
		};
	}
}
